import Alpine from 'alpinejs';
import { ImgAuth, ImgAPIClient } from '@img-pro/api';

// Initialize Alpine
window.Alpine = Alpine;

// Initialize auth and API clients
window.imgAuth = new ImgAuth();
window.imgAPI = new ImgAPIClient(window.imgAuth);

// Alpine component for media gallery
Alpine.data('mediaGallery', () => ({
  authenticated: false,
  media: [],
  stats: null,
  loading: false,
  selectedItem: null,
  tokenInput: '',
  authUrl: window.imgAuth.authUrl,
  copiedUrl: null,
  nextCursor: null,
  hasMore: false,

  async init() {
    // Check if user is authenticated
    const token = window.imgAuth.getToken();
    if (token) {
      this.authenticated = await window.imgAuth.isAuthenticated();
      if (this.authenticated) {
        await this.loadMedia();
      }
    }
  },

  async setToken() {
    if (!this.tokenInput) return;

    // Save token
    localStorage.setItem('img_api_token', this.tokenInput);

    // Verify it works
    this.loading = true;
    this.authenticated = await window.imgAuth.isAuthenticated();

    if (this.authenticated) {
      await this.loadMedia();
      this.tokenInput = ''; // Clear input
    } else {
      alert('Invalid token. Please check and try again.');
      localStorage.removeItem('img_api_token');
    }

    this.loading = false;
  },

  async login() {
    await window.imgAuth.login();
  },

  async logout() {
    await window.imgAuth.logout();
    this.authenticated = false;
    this.media = [];
    this.stats = null;
    this.tokenInput = '';
    this.nextCursor = null;
    this.hasMore = false;
  },

  async loadMedia(append = false) {
    this.loading = true;
    try {
      const params = {
        limit: 50
      };

      // Add cursor for pagination
      if (append && this.nextCursor) {
        params.cursor = this.nextCursor;
      }

      const response = await window.imgAPI.listMedia(params);

      console.log('API Response:', response);

      // The response has data array, next_cursor, and has_more
      const items = response.data || [];

      if (append) {
        this.media = [...this.media, ...items];
      } else {
        this.media = items;
      }

      console.log('Media items:', this.media);

      // Update pagination state
      this.nextCursor = response.next_cursor || null;
      this.hasMore = response.has_more || false;

      this.stats = {
        count: this.media.length,
        totalSize: this.media.reduce((sum, item) => sum + (item.filesize || 0), 0)
      };
    } catch (error) {
      console.error('Failed to load media:', error);
    } finally {
      this.loading = false;
    }
  },

  async loadMore() {
    if (!this.hasMore || this.loading) return;
    await this.loadMedia(true);
  },

  async deleteItem(id) {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await window.imgAPI.deleteMedia(id);
      this.media = this.media.filter(item => item.id !== id);
      this.stats = {
        count: this.media.length,
        totalSize: this.media.reduce((sum, item) => sum + (item.filesize || 0), 0)
      };
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Failed to delete image');
    }
  },

  openSize(item, size) {
    if (!item.src) return;
    const url = size === 'original' ? item.src : `${item.src}?size=${size}`;
    window.open(url, '_blank');
  },

  async copyUrl(url) {
    try {
      await navigator.clipboard.writeText(url);
      this.copiedUrl = url;
      setTimeout(() => {
        this.copiedUrl = null;
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  },

  formatSize(bytes) {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 10) / 10 + ' ' + sizes[i];
  },

  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  },
}));

// Start Alpine
Alpine.start();