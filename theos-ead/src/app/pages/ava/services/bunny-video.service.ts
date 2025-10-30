import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BunnyVideoService {

  private baseUrl = 'https://video.bunnycdn.com/OEmbed';

  constructor(private http: HttpClient) {}

  //<div style="position:relative;padding-top:56.25%;"><iframe src="https://iframe.mediadelivery.net/embed/414218/e6c98f84-17ed-43ef-a07c-431fb05f73d6?token=dc795c6b4661804ac1d7ee2d03cf64750ec49c7b6ab6ff09bef84c1070e266de&expires=1746300155&autoplay=false&loop=false&muted=false&preload=true&responsive=true" loading="lazy" style="border:0;position:absolute;top:0;height:100%;width:100%;" allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;" allowfullscreen="true"></iframe></div>

  getVideoData(token: string, idVideo: string, expiration: number): Observable<any> {
    
    const headers = new HttpHeaders({ 'accept': 'application/json' });
  
    const rawUrl = `https://iframe.mediadelivery.net/embed/414218/${idVideo}`;
    const encodedUrl = encodeURIComponent(rawUrl); // só uma vez
  
    const finalUrl = `https://video.bunnycdn.com/OEmbed?url=${encodedUrl}&maxWidth=850&maxHeight=480&token=${token}&expires=${expiration}`;
    return this.http.get(finalUrl, { headers });
  }
}
