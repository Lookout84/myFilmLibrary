const maxRequestToServer = 5;

export async function adoptPPFetch({ page, perPage, sPerPage = 20, doFetch }) {
  let from = (page - 1) * perPage;
  let to = page * perPage;
  let results = [];
  let buffer = [];
  let requestsToServer = 0;
  let sPage = Math.floor(from / sPerPage) + 1;
  for (let i = from; i < to; ) {
    if (buffer[i]) {
      results.push(buffer[i]);
      i++;
      continue;
    } else {
      if (requestsToServer > maxRequestToServer) {
        console.warn('too many requests to the server');
        break;
      }
      requestsToServer++;
      const sData = await doFetch(sPage);
      const sResults = sData.results;
      to = Math.min(to, sData.total_results);
      const sFrom = (sPage - 1) * sPerPage;
      const sTo = sPage * sPerPage;
      for (let sI = sFrom, x = 0; x < sResults.length && sI < sTo; sI++, x++) {
        const sResult = sResults[x];
        buffer[sI] = { sPage: sPage, ...sResult };
      }
      sPage++;
    }
  }
  return results;
}
