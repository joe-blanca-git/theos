import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private readonly apiKey = 'SUA_API_KEY'; 
  private readonly libraryId = 'SEU_LIBRARY_ID';

  constructor(private http: HttpClient) { }

  uploadVideo(videoFile: File, title: string) {
    const createUrl = `https://video.bunnycdn.com/library/${this.libraryId}/videos`;

    const createHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'AccessKey': this.apiKey
    });

    return this.http.post<{ guid: string }>(createUrl, { title }, { headers: createHeaders }).pipe(
      switchMap(response => {
        const videoGuid = response.guid;
        if (!videoGuid) {
          return of(null);
        }
        const uploadUrl = `https://video.bunnycdn.com/library/${this.libraryId}/videos/${videoGuid}`;
        
        const uploadHeaders = new HttpHeaders({
          'Accept': 'application/json',
          'AccessKey': this.apiKey
        });
        return this.http.put(uploadUrl, videoFile, { headers: uploadHeaders });
      })
    );
  }

  getVideoDuration(file: File): Observable<number> {
    return new Observable<number>(subscriber => {
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';

      videoElement.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoElement.src);
        
        const duration = videoElement.duration;
        subscriber.next(duration);
        subscriber.complete();
      };
      
      videoElement.onerror = (error) => {
        subscriber.error('Erro ao carregar metadados do vídeo.');
      };

      videoElement.src = URL.createObjectURL(file);
    });
  }
}