import { TIMEOUT_SEC } from "./config";
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export async function AJAX(url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const json = await res.json();
    if (!res.ok) throw new Error(`${json.message} (${res.status})`);
    return json;
  } catch (error) {
    throw error; // So we basically propagated the error down from one async function to the other by re-throwing the error here in this catch block
  }
}

/*
export async function getJSON(url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const json = await res.json();
    if (!res.ok) throw new Error(`${json.message} (${res.status})`);
    return json;
  } catch (error) {
    throw error; // So we basically propagated the error down from one async function to the other by re-throwing the error here in this catch block
  }
}

export async function sendJSON(url, uploadData) {
  try {
    const res = await Promise.race([
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uploadData),
      }),
      timeout(TIMEOUT_SEC),
    ]);
    const json = await res.json();
    if (!res.ok) throw new Error(`${json.message} (${res.status})`);
    return json;
  } catch (error) {
    throw error; // So we basically propagated the error down from one async function to the other by re-throwing the error here in this catch block
  }
}
*/
