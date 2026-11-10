import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  GroupDetail,
  GroupRanking,
  GroupSummary,
} from '../models/group.model';

@Injectable({ providedIn: 'root' })
export class GroupsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/groups`;

  listMine(): Promise<GroupSummary[]> {
    return firstValueFrom(this.http.get<GroupSummary[]>(`${this.base}/mine`));
  }

  create(name: string): Promise<GroupSummary> {
    return firstValueFrom(this.http.post<GroupSummary>(this.base, { name }));
  }

  join(code: string): Promise<GroupSummary> {
    return firstValueFrom(this.http.post<GroupSummary>(`${this.base}/join`, { code }));
  }

  getDetail(groupId: string): Promise<GroupDetail> {
    return firstValueFrom(this.http.get<GroupDetail>(`${this.base}/${groupId}`));
  }

  getRanking(): Promise<GroupRanking> {
    return firstValueFrom(this.http.get<GroupRanking>(`${this.base}/ranking`));
  }

  leave(groupId: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.base}/${groupId}/leave`));
  }

  remove(groupId: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.base}/${groupId}`));
  }

  removeMember(groupId: string, userId: string): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(`${this.base}/${groupId}/members/${userId}`),
    );
  }
}
