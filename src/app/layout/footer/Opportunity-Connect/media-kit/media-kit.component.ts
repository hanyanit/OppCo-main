import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Import this

@Component({
  selector: 'app-media-kit',
  standalone: true, // ✅ Assuming you're using standalone components
  imports: [CommonModule], // ✅ Include CommonModule here
  templateUrl: './media-kit.component.html',
  styleUrls: ['./media-kit.component.scss']
})
export class MediaKitComponent {
  mediaAssets = [
    {
      title: 'General Poster (A4)',
      thumbnail: 'assets/media/poster-a4-thumb.jpg',
      downloadUrl: 'assets/images/legal.png'
    },
    {
      title: 'Social Media Post',
      thumbnail: 'assets/media/social-thumb.jpg',
      downloadUrl: 'assets/media/social-post.jpg'
    },
    {
      title: 'WhatsApp Flyer',
      thumbnail: 'assets/media/whatsapp-thumb.jpg',
      downloadUrl: 'assets/media/whatsapp-flyer.jpg'
    }
  ];
}