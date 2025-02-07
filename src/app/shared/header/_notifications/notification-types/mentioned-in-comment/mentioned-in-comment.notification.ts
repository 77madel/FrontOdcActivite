import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-mentioned-in-comment',
    imports: [
        MatIcon,
        MatRipple,
        RouterLink,
    ],
    templateUrl: './mentioned-in-comment.notification.html',
    styleUrl: './mentioned-in-comment.notification.scss'
})
export class MentionedInCommentNotification {
  @Input()
  notification: Notification | undefined;
}
