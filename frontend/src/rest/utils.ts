type NextUrlCb = (res: any) => string;
type ReduceResponsesCb = (acc: any[], e: any, i: number) => any;
type ReduceArgs = { callbackFn: ReduceResponsesCb, initialValue: any };
export const fetchOffsets = (nextUrl: NextUrlCb, reduceArgs: ReduceArgs, limit: number | null = null) => async (resource: string, options: any) => {
  const responses: object[] = [];
  let url = resource;
  let i = 0;
  do {
    const res = await fetch(url, options);
    if (!res.ok) return res;
    
    const json = await res.json();
    responses.push(json);
    url = nextUrl(json);
    if (limit && i++ < limit) break;
  } while (url);
  
  const body = { items: responses.reduce(reduceArgs.callbackFn, reduceArgs.initialValue) };
  return new Response(new Blob([JSON.stringify(body)], {type : 'application/json'}));
}