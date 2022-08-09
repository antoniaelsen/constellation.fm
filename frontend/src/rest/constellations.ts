import config from 'config';
import { Service } from 'lib/constants';


export const requestParams = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  credentials: "include"
};

export const getConstellation = async (id: string) => {
  const options = {
    ...requestParams,
    method: "GET"
  };
  const res = await fetch( `${config.api.backend}/constellation/${id}`, (options as any));
  const body = await res?.json();
  console.log("Got fetch constellation res", body)
  return body;
};

export const getConstellationByPlaylist = async ({ serviceId, service }: { serviceId: string; service: Service }) => {
  const options = {
    ...requestParams,
    method: "GET"
  };
  const res = await fetch( `${config.api.backend}/constellation/${service}/${serviceId}`, (options as any));
  const body = await res?.json();
  console.log("Got fetch constellation res", body)
  return body;
};

