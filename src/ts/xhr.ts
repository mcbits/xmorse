export function Load(url: string, responseType: string): Promise<any> {
    return new Promise<any>(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.responseType = responseType;
        request.open("GET", url);
        request.onload = () => {
            if (request.status === 200)
                resolve(request.response);
            else
                reject(Error("There was a problem downloading the data: " + request));
        };
        request.onerror = () => reject(Error("There was a problem downloading the data: " + request));
        request.send();
    });
}
