import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: '674518eb198db4ef90caebb299e51001662c52df', queries,  });
export default client;
  