import * as React from 'react'
import {
	FITReader,
	HeartRateZoneMapping,
	SpeedToPace,
	PaceToSpeed,
	FormatPaceToString,
	CadenceZoneMapping
} from '../utils/fit'
import { LineChart, ScatterChart } from '@mui/x-charts'
import { createContext, useContext, useEffect, useState } from 'react'
import moment from 'moment'
import Loadable from 'react-loadable'
import { atom, map } from 'nanostores'
import { useStore } from '@nanostores/react'
import styled from '@emotion/styled'

const LoadablePlotlyPlot = Loadable({
	loader: () => import('react-plotly.js'),
	loading() {
		return <div>Loading...</div>
	}
})

export const FITDataContext = createContext()
export const FITDataStore = map({})
const FITREADERKEY = 'fitReader'
const FITDATAKEY = 'fitData'

const fitFileLoaderEffect = (providerID, fitFile, setFitReader) => {
	return () => {
		if (typeof window !== 'undefined') {
			const _fitReader = new FITReader(fitFile)
			setFitReader(_fitReader)
			if (!providerID) {
				return
			}
			FITDataStore.setKey(providerID, {
				fitReader: _fitReader,
				fitData: _fitReader.fitData
			})
		}
	}
}

const fitDataLoaderEffect = (providerID, fitReader, setFitData) => {
	return () => {
		const fetchData = async () => {
			if (!fitReader) {
				return
			}
			let fitData = await fitReader.read()
			setFitData(fitData)
			if (!providerID) {
				return
			}
			FITDataStore.setKey(providerID, {
				fitReader,
				fitData
			})
		}
		fetchData()
	}
}

const fitDataStoreEffect = (setFitReader, setFitData, $fitDataStore) => {
	return () => {
		if (!$fitDataStore) {
			return
		}
		const { fitReader, fitData } = $fitDataStore
		if (fitReader) {
			setFitReader(fitReader)
		}
		if (fitData) {
			setFitData(fitData)
		}
	}
}

const FITChartWrapper = ({ className, children }) => {
	const StyledDiv = styled.div`
		overflow-x: auto;
		white-space: nowrap;
	`
	return <StyledDiv className={`${className} m-8`}>{children}</StyledDiv>
}

export const FITDataProvider = ({ id, fitFile, children }) => {
	const [fitReader, setFitReader] = useState(null)
	const [fitData, setFitData] = useState(null)
	const $fitDataStore = useStore(FITDataStore)
	useEffect(fitFileLoaderEffect(id, fitFile, setFitReader), [])
	useEffect(fitDataLoaderEffect(id, fitReader, setFitData), [fitReader])
	useEffect(fitDataStoreEffect(setFitReader, setFitData, $fitDataStore), [])
	if (FITDataContext) {
		return (
			<FITDataContext.Provider
				value={{
					fitReader,
					fitData,
					setFitReader,
					setFitData
				}}
			>
				{children}
			</FITDataContext.Provider>
		)
	}
	return { children }
}

export const ActivityEmbedViewer = ({ activityId, title }) => {
	return (
		<div className={'fit-viewer'}>
			<iframe
				src={`https://connect.garmin.com/modern/activity/embed/${activityId}`}
				title={title}
				width='465'
				height='500'
				frameBorder='0'
			></iframe>
		</div>
	)
}

function retrieveFromContextOrStore() {
	const ctx = useContext(FITDataContext)
	if (ctx !== undefined) {
		return ctx
	}
	const store = FITDataStore.get()
	return store
}

export const HeartRateViewer = ({ providerID, fitFile, width, height, useMUI }) => {
	const [fitReader, setFitReader] = useState(null)
	const [fitData, setFitData] = useState(null)
	const [chartData, setChartData] = useState(null)
	const [hrZoneBoundary, setHRZoneBoundary] = useState(null)
	const $fitDataContext = useContext(FITDataContext)
	const $fitDataStore = useStore(FITDataStore)

	if (fitFile) {
		useEffect(fitFileLoaderEffect(providerID, fitFile, setFitReader), [])
		useEffect(fitDataLoaderEffect(providerID, fitReader, setFitData), [fitReader])
	} else {
		useEffect(() => {
			if (!$fitDataContext) {
				return
			}
			setFitData($fitDataContext.fitData)
		}, [$fitDataContext])
		useEffect(() => {
			if (!$fitDataStore || !providerID) {
				return
			}
			if (!$fitDataStore[providerID]) {
				return
			}
			const { fitReader, fitData } = $fitDataStore[providerID]
			setFitData(fitData)
			setFitReader(fitReader)
		}, [$fitDataStore])
	}

	useEffect(() => {
		const fetchData = async () => {
			if (!fitReader) {
				return
			}
			if (!fitData) {
				return
			}
			let records = fitData.messages.recordMesgs
			let hrZoneHighBoundary = fitData.messages.timeInZoneMesgs[0].hrZoneHighBoundary
			setHRZoneBoundary(hrZoneHighBoundary)
			const chartData = records.reduce(
				(acc, cur) => {
					if (acc.xAxis.length === 0) {
						acc.startTimeStamp = cur.timestamp
						acc.xAxis.push(cur.timestamp)
						acc.heartRateData.push(cur.heartRate)
						const hrZone = HeartRateZoneMapping(cur.heartRate, hrZoneHighBoundary)
						acc.thresholdsClass.push(hrZone.zoneColor)
						return acc
					}
					acc.xAxis.push(cur.timestamp)
					acc.heartRateData.push(cur.heartRate)
					// zone calculation
					const prevZoneColor = acc.thresholdsClass[acc.thresholdsClass.length - 1]
					const hrZone = HeartRateZoneMapping(cur.heartRate, hrZoneHighBoundary)
					if (hrZone.zoneColor !== prevZoneColor) {
						acc.thresholdsData.push(cur.timestamp)
						acc.thresholdsClass.push(hrZone.zoneColor)
					}
					return acc
				},
				{
					startTimeStamp: null,
					xAxis: [],
					heartRateData: [],
					thresholdsData: [],
					thresholdsClass: []
				}
			)
			setChartData(chartData)
		}
		fetchData()
	}, [fitData, fitReader, $fitDataContext, $fitDataStore])

	if (chartData === undefined || chartData === null) {
		return <div>Loading</div>
	}
	if (useMUI === undefined) {
		useMUI = true
	}
	if (useMUI) {
		return (
			<FITChartWrapper className={'heart-rate-viewer'}>
				<LineChart
					client:only={'react'}
					title={'Heart Rate (bpm)'}
					className={'bg-white'}
					xAxis={[
						{
							colorMap: {
								type: 'piecewise',
								thresholds: chartData.thresholdsData.map((val) => {
									return val - chartData.startTimeStamp
								}),
								colors: chartData.thresholdsClass
							},
							data: chartData.xAxis.map((val) => {
								return val - chartData.startTimeStamp
							}),
							scaleType: 'point',
							tickInterval: (value, index) => {
								return value % (60 * 1000 * 10) === 0
							},
							valueFormatter: (timeSpan, context) => {
								return moment(timeSpan).utc().format('HH:mm:ss')
							}
						}
					]}
					series={[
						{
							label: 'Heart Rate (bpm)',
							data: chartData.heartRateData,
							showMark: false,
							curve: 'linear',
							color: 'red',
							valueFormatter: (value) => {
								const hrZone = HeartRateZoneMapping(value, hrZoneBoundary)
								return <span>{`${hrZone.zoneClass} ${value} bpm`}</span>
							},
							area: true
						}
					]}
					disableLineItemHighlight
					width={width || 800}
					height={height || 300}
				/>
			</FITChartWrapper>
		)
	}
	return (
		<LoadablePlotlyPlot
			client:only={'react'}
			className={'bg-white'}
			data={[
				{
					x: chartData.xAxis,
					y: chartData.heartRateData,
					type: 'scatter',
					fill: 'tozeroy',
					mode: 'lines',
					marker: { color: 'red' }
				}
			]}
			layout={{
				width: width || 800,
				height: height || 300,
				title: 'Heart Rate (bpm)'
			}}
		/>
	)
}

export const PaceViewer = ({ providerID, fitFile, width, height, useMUI }) => {
	const [fitReader, setFitReader] = useState(null)
	const [fitData, setFitData] = useState(null)
	const [chartData, setChartData] = useState(null)
	const $fitDataContext = useContext(FITDataContext)
	const $fitDataStore = useStore(FITDataStore)

	if (fitFile) {
		useEffect(fitFileLoaderEffect(providerID, fitFile, setFitReader), [])
		useEffect(fitDataLoaderEffect(providerID, fitReader, setFitData), [fitReader])
	} else {
		useEffect(() => {
			if (!$fitDataContext) {
				return
			}
			setFitData($fitDataContext.fitData)
		}, [$fitDataContext])
		useEffect(() => {
			if (!$fitDataStore || !providerID) {
				return
			}
			if (!$fitDataStore[providerID]) {
				return
			}
			const { fitReader, fitData } = $fitDataStore[providerID]
			setFitData(fitData)
			setFitReader(fitReader)
		}, [$fitDataStore])
	}
	useEffect(() => {
		const fetchData = async () => {
			if (!fitReader) {
				return
			}
			if (!fitData) {
				return
			}
			let records = fitData.messages.recordMesgs
			const chartData = records.reduce(
				(acc, cur) => {
					if (acc.xAxis.length === 0) {
						acc.startTimeStamp = cur.timestamp
						acc.xAxis.push(cur.timestamp)
						acc.paceData.push(cur.enhancedSpeed)
						return acc
					}
					acc.xAxis.push(cur.timestamp)
					acc.paceData.push(cur.enhancedSpeed)
					return acc
				},
				{
					startTimeStamp: null,
					xAxis: [],
					paceData: []
				}
			)
			setChartData(chartData)
		}

		fetchData()
	}, [fitData])

	if (chartData === undefined || chartData === null) {
		return <div>Loading</div>
	}
	if (useMUI === undefined) {
		useMUI = true
	}
	if (useMUI) {
		return (
			<FITChartWrapper className={'pace-viewer'}>
				<LineChart
					className={'bg-white'}
					xAxis={[
						{
							data: chartData.xAxis.map((val) => {
								return val - chartData.startTimeStamp
							}),
							scaleType: 'point',
							tickInterval: (value, index) => {
								return value % (60 * 1000 * 10) === 0
							},
							valueFormatter: (timeSpan, context) => {
								return moment(timeSpan).utc().format('HH:mm:ss')
							}
						}
					]}
					yAxis={[
						{
							scaleType: 'linear',
							valueFormatter: (speed, context) => {
								try {
									return FormatPaceToString(SpeedToPace(speed))
								} catch (e) {}
								return ''
							}
						}
					]}
					series={[
						{
							label: 'Pace (min/km)',
							data: chartData.paceData,
							showMark: false,
							curve: 'linear',
							color: 'blue',
							area: true,
							valueFormatter: (speed, context) => {
								try {
									return FormatPaceToString(SpeedToPace(speed))
								} catch (e) {}
								return ''
							}
						}
					]}
					disableLineItemHighlight
					width={width || 800}
					height={height || 300}
				/>
			</FITChartWrapper>
		)
	}
	return (
		<LoadablePlotlyPlot
			className={'bg-white'}
			data={[
				{
					x: chartData.xAxis,
					y: chartData.paceData,
					type: 'scatter',
					fill: 'tozeroy',
					mode: 'lines',
					marker: { color: 'blue' }
				}
			]}
			layout={{
				width: width || 800,
				height: height || 300,
				title: 'Pace (m/s)'
			}}
		/>
	)
}

export const CadenceViewer = ({ providerID, fitFile, width, height, useMUI }) => {
	const [fitReader, setFitReader] = useState(null)
	const [fitData, setFitData] = useState(null)
	const [chartData, setChartData] = useState(null)
	const $fitDataContext = useContext(FITDataContext)
	const $fitDataStore = useStore(FITDataStore)
	if (fitFile) {
		useEffect(fitFileLoaderEffect(providerID, fitFile, setFitReader), [])
		useEffect(fitDataLoaderEffect(providerID, fitReader, setFitData), [fitReader])
	} else {
		useEffect(() => {
			if (!$fitDataContext) {
				return
			}
			setFitData($fitDataContext.fitData)
		}, [$fitDataContext])
		useEffect(() => {
			if (!$fitDataStore || !providerID) {
				return
			}
			if (!$fitDataStore[providerID]) {
				return
			}
			const { fitReader, fitData } = $fitDataStore[providerID]
			setFitData(fitData)
			setFitReader(fitReader)
		}, [$fitDataStore])
	}
	useEffect(() => {
		const fetchData = async () => {
			if (!fitReader) {
				return
			}
			if (!fitData) {
				return
			}
			let records = fitData.messages.recordMesgs
			const chartData = records.reduce(
				(acc, cur) => {
					if (acc.xAxis.length === 0) {
						acc.startTimeStamp = cur.timestamp
						acc.xAxis.push(cur.timestamp)
						let cadence = cur.cadence || 0
						cadence = cadence * 2
						acc.cadenceData.push(cadence)
						return acc
					}
					let cadence = cur.cadence || 0
					cadence = cadence * 2
					acc.xAxis.push(cur.timestamp)
					acc.cadenceData.push(cadence)
					return acc
				},
				{
					startTimeStamp: null,
					xAxis: [],
					cadenceData: []
				}
			)
			setChartData(chartData)
		}

		fetchData()
	}, [fitData])

	if (chartData === undefined || chartData === null) {
		return <div>Loading</div>
	}
	if (useMUI === undefined) {
		useMUI = true
	}
	if (useMUI) {
		return (
			<FITChartWrapper className={'cadence-viewer'}>
				<LineChart
					className={'bg-white'}
					xAxis={[
						{
							data: chartData.xAxis.map((val) => {
								return val - chartData.startTimeStamp
							}),
							scaleType: 'point',
							tickInterval: (value, index) => {
								return value % (60 * 1000 * 10) === 0
							},
							valueFormatter: (timeSpan, context) => {
								return moment(timeSpan).utc().format('HH:mm:ss')
							}
						}
					]}
					yAxis={[
						{
							scaleType: 'linear',
							colorMap: {
								type: 'piecewise',
								thresholds: [151, 163, 174, 186],
								colors: ['#ff0035', '#ed7e00', '#50b012', '#11a9ed', '#cf23b8']
							}
						}
					]}
					series={[
						{
							label: 'Cadence (spm)',
							data: chartData.cadenceData,
							color: '#cf23b8',
							showMark: false,
							curve: 'linear',
							valueFormatter: (cadence, context) => {
								return `${cadence} spm ${CadenceZoneMapping(cadence)}`
							}
						}
					]}
					disableLineItemHighlight
					width={width || 800}
					height={height || 300}
				/>
			</FITChartWrapper>
		)
	}
	return (
		<LoadablePlotlyPlot
			className={'bg-white'}
			data={[
				{
					x: chartData.xAxis,
					y: chartData.cadenceData,
					type: 'scatter',
					fill: 'tozeroy',
					mode: 'markers',
					marker: { color: 'magenta' }
				}
			]}
			layout={{
				width: width || 800,
				height: height || 300,
				title: 'Cadence (spm)'
			}}
		/>
	)
}
