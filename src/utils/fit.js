import { Decoder, Stream, Profile, Utils } from '@garmin/fitsdk'

export class FITReader {
	constructor(filePath, mesgListener) {
		this.filePath = filePath
		this.mesgListener = mesgListener
		this.decoder = null
		this.fitData = null
		this.decoderReady = fetch(this.filePath)
			.then((response) => response.arrayBuffer())
			.then((buffer) => {
				const fitStream = Stream.fromArrayBuffer(buffer)
				this.decoder = new Decoder(fitStream)
			})
	}

	async read() {
		if (this.fitData !== undefined && this.fitData !== null) {
			return this.fitData
		}
		return this.decoderReady.then(() => {
			let fitData = this.decoder.read({
				mesgListener: this.mesgListener,
				mergeHeartRates: true
			})
			this.fitData = fitData
			return fitData
		})
	}
}

export const HeartRateZoneMapping = (heartRate, hrZoneBoundary) => {
	let [z0, z1, z2, z3, z4, z5] = hrZoneBoundary
	switch (true) {
		case heartRate > z4:
			return {
				zoneClass: 'Z5',
				zoneColor: '#d32020'
			}
		case heartRate > z3 && heartRate <= z4:
			return {
				zoneClass: 'Z4',
				zoneColor: '#ed7e00'
			}
		case heartRate > z2 && heartRate <= z3:
			return {
				zoneClass: 'Z3',
				zoneColor: '#50b012'
			}
		case heartRate > z1 && heartRate <= z2:
			return {
				zoneClass: 'Z2',
				zoneColor: '#3b97f3'
			}
		case heartRate > z0 && heartRate <= z1:
			return {
				zoneClass: 'Z1',
				zoneColor: '#a6a6a6'
			}
		default:
			return {
				zoneClass: 'No Zone',
				zoneColor: '#a6a6a6'
			}
	}
}

export const CadenceZoneMapping = (cadence) => {
	let [z1, z2, z3, z4] = [151, 163, 174, 186]
	switch (true) {
		case cadence > z4:
			return {
				zoneClass: 'Purple: >95%',
				zoneColor: '#cf23b8'
			}
		case cadence > z3 && cadence <= z4:
			return {
				zoneClass: 'Blue: 70 - 95%',
				zoneColor: '#11a9ed'
			}
		case cadence > z2 && cadence <= z3:
			return {
				zoneClass: 'Green: 30 - 69%',
				zoneColor: '#50b012'
			}
		case cadence > z1 && cadence <= z2:
			return {
				zoneClass: 'Orange: 5 - 29%',
				zoneColor: '#ed7e00'
			}
		default:
			return {
				zoneClass: 'Red: < 5%',
				zoneColor: '#ff0035'
			}
	}
}

// DISCLAIMER: Generated using Jetbrains AI Assistant. Can be stupid.
export const SpeedToPace = (speed) => {
	if (speed <= 0) {
		throw new Error('invalid speed')
	}
	// Conversion factor: meters per second (m/s) to kilometers per hour (km/h)
	const speedInKmH = speed * 3.6

	// Conversion from kilometers per hour to minutes per kilometer
	const paceInMinKm = 60 / speedInKmH

	// Considering only two decimal places
	return paceInMinKm.toFixed(2)
}

// DISCLAIMER: Generated using Jetbrains AI Assistant. Can be stupid.
export const PaceToSpeed = (paceString) => {
	const [minutes, seconds] = paceString.split(':').map(parseFloat)
	// Convert the pace from min/km to hours/km
	const paceInHoursPerKm = (minutes + seconds / 60) / 60
	// Convert the pace from hours/km to speed in km/h
	const speedInKmPerHour = 1 / paceInHoursPerKm
	// Convert the speed from km/h to m/s
	const speedInMetersPerSecond = speedInKmPerHour / 3.6

	return speedInMetersPerSecond.toFixed(2)
}

// DISCLAIMER: Generated using Jetbrains AI Assistant. Can be stupid.
export const FormatPaceToString = (pace) => {
	const minutes = Math.floor(pace)
	const seconds = Math.round((pace - minutes) * 60)

	return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}
