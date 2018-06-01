namespace Xhr
{
	export function Load<T>(url: string, responseType: string, success: (_: T) => void): void
	{
		const request = new XMLHttpRequest();
		request.responseType = <XMLHttpRequestResponseType>responseType;
		request.onload = () =>
		{
			if (request.status === 200)
				success(request.response);
			else
				console.error("Sever request failed: ", request);
		};
		request.onerror = () => { console.error("Server request failed: ", request); };
		request.open("GET", url);
		request.send();
	}
}
