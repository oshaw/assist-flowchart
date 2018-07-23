export const callAPI = (endpoint, body) => {
  return new Promise((resolve, reject) => {
    let serializedBody = '';
    for (const key in body) {
      serializedBody += '&' + key + '=' + body[key];
    }
    fetch('./api?endpoint=' + endpoint + serializedBody).then((response) => {
      if (response.status !== 200) {
        reject(response);
      }
      else {
        response.json().then((json) => {
          resolve(json);
        }).catch(reject);
      }
    }).catch(reject);
  });
}
export const capitalize = (string) => {
  return string[0].toUpperCase() + string.substring(1);
}
