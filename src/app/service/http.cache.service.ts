import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HttpCacheService {

  private httpResponseCache: { [key: string]: HttpResponse<any> } = {};

  put(key: string, httpResponse: HttpResponse<any>) {
    this.httpResponseCache[key] = httpResponse;
    console.log(this.httpResponseCache);
  }

  get(key: string) {
    return this.httpResponseCache[key];
  }

  evict(key: string): boolean {
    if (this.httpResponseCache[key]) {
      delete this.httpResponseCache[key];
      return true;
    } else {
      return false;
    }
  }

  evictAll() {
    console.log('Before deletion' + this.httpResponseCache);
    this.httpResponseCache = {};
    console.log('After deletion' + this.httpResponseCache);
  }

  logCache() {
    console.log(this.httpResponseCache);
  }
}
