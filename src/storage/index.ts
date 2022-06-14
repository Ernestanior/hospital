export function setCookie(name: string, value: any, days: number) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
export function getCookie(name: string) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
export function eraseCookie(name: string) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

export enum Flag {
  CLOSE = "close",
  CREATE = "create",
  EDIT = "edit",
  DELETE = "delete",
  DETAIL = "detail",
}

export const convertTime = (time: string) => {
  if (!time) {
    return "";
  }
  if (time.length === 4) {
    return time.slice(0, 2) + ":" + time.slice(2);
  }
  return time.slice(0, 4) + "-" + time.slice(4, 6) + "-" + time.slice(6, 8);
};

export const reConvertTime = (time: string) => {
  return time.split("-").join("");
};
// 一天的时间戳： 1000*60*60*24
export const TimePerDay = 86400000;
