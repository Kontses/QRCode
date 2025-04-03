interface SharePointConfig {
  siteUrl: string;
  clientId: string;
  clientSecret: string;
}

interface SharePointFile {
  id: string;
  name: string;
  webUrl: string;
  lastModifiedDateTime: string;
  content?: string;
}

export class SharePointService {
  private config: SharePointConfig;
  private token: string | null = null;
  private graphApiUrl = 'https://graph.microsoft.com/v1.0';

  constructor(config: SharePointConfig) {
    this.config = config;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('sharepoint_token');
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const response = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          scope: 'https://graph.microsoft.com/.default',
          grant_type: 'password',
          username: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      this.token = data.access_token;
      localStorage.setItem('sharepoint_token', this.token);
      localStorage.setItem('sharepoint_email', email);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async getFiles(): Promise<SharePointFile[]> {
    if (!this.token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${this.graphApiUrl}/sites/${this.config.siteUrl}/drive/root/children`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }

      const data = await response.json();
      return data.value.map((file: any) => ({
        id: file.id,
        name: file.name,
        webUrl: file.webUrl,
        lastModifiedDateTime: file.lastModifiedDateTime,
      }));
    } catch (error) {
      console.error('Error fetching files:', error);
      throw error;
    }
  }

  async getFileContent(fileId: string): Promise<string> {
    if (!this.token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${this.graphApiUrl}/sites/${this.config.siteUrl}/drive/items/${fileId}/content`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch file content');
      }

      return await response.text();
    } catch (error) {
      console.error('Error fetching file content:', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout(): void {
    localStorage.removeItem('sharepoint_token');
    localStorage.removeItem('sharepoint_email');
    this.token = null;
  }
} 