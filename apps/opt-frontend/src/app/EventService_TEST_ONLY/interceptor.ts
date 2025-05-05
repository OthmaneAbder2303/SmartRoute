import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';

export const csrfInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
  };
  const token = getCookie('XSRF-TOKEN');
  if (token) {
    req = req.clone({
      headers: req.headers.set('X-XSRF-TOKEN', token),
      withCredentials: true
    });
  }

  return next(req);
};
