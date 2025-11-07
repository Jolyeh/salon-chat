import { io } from "socket.io-client";
import { urlApi } from "./constant";

export const socket = io(urlApi);