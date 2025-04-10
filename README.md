# UTags Bookmark Manager

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/utags/utags-bookmarks/ci.yml?branch=main)](https://github.com/utags/utags-bookmarks/actions)
[![UTags Official Site](https://img.shields.io/badge/UTags-Official_Site-brightgreen)](https://utags.link)

> English | [中文](README.zh-CN.md)

## 🚀 Project Overview

**UTags Bookmark Manager** is a modern bookmark manager that organizes web resources using a flexible tagging system. Designed for developers and power users who need to manage large collections of bookmarks with smart filtering and visualization capabilities.

Visit our [official website (https://utags.link)](https://utags.link/) to explore comprehensive features.

## ✨ Core Features

- Multi-dimensional tag management system
- Composite filtering system with AND/OR logic
- Local data persistence via LocalStorage
- **Progressive Web App (PWA) support**:
  - Installable on desktop/mobile devices
  - Offline access to bookmarks
  - Automatic background updates
- Powered by the [UTags extension/userscript](https://github.com/utags/utags)

### Other Features

- Progressive Web App capabilities:
  - Add to Home Screen (A2HS)
  - Offline mode with Service Worker caching
  - Web App Manifest for native-like experience
- Fully open source and free to use
- Easy self-hosting deployment
- Saved filter presets
- Data import/export capabilities
- Multi-device synchronization (TODO)
- Visual data statistics dashboard
- Light/dark theme support
- Responsive layout with multiple view modes
- Cross-browser compatibility

## Usages

### How to add a bookmark

- Add bookmarks on bookmark manager page
- Add bookmarks via [UTags extension/userscript](https://github.com/utags/utags)
- Add bookmarks via bookmarklet
- Make your own extension or userscript

### How to use filters

- Filter by keywords, tags, domains, and other metadata
- Multi-level filtering system supporting AND/OR logic combinations
- Save filter presets for quick access in future sessions

## 🛣 Development Roadmap

- **Bookmark Management Enhancements**

  - Edit/Delete bookmarks
  - Batch modify/delete tags
  - Bulk delete bookmarks
  - Bulk add tags
  - Note adding functionality
  - Note viewing interface
  - Filtering with regular expression

- **Bookmark Collection Solutions**

  - Add bookmarks via [UTags extension/userscript](https://github.com/utags/utags)
  - Add bookmarks via bookmarklet
  - Custom styling options
  - Navigation website style view

- **Data Interoperability**

  - Gist/GitHub import/export support
  - WebDAV import/export support
  - Browser bookmark import (Chrome/Firefox)
  - Multi-device sync solution
  - Cloud sync capability
  - Bookmark export/import enhancements
  - Use IndexedDB storage when the bookmark volume is extremely large

## 📦 Installation & Usage

### Prerequisites

- Node.js 18+
- npm 9+

### Development

```bash
npm install
npm run dev
```

Access the application at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## 🛠 Development

### Data Management

Generate mock data for development:

```bash
node generate-mock-data.js
```

Development data is stored in browser's Local storage. To reset:

1. Visit application website and open Browser Developer Tools
2. Application → Local storage → Clear data

## 🤝 Contributing

Contributions through:

- 🐛 GitHub Issues for bug reports
- 💡 Pull Requests for feature additions

Please follow our [contribution guidelines](CONTRIBUTING.md).

## 📄 License

Copyright (c) 2025 [Pipecraft](https://www.pipecraft.net). Licensed under the [MIT License](LICENSE).

---

[![Pipecraft Ecosystem](https://img.shields.io/badge/Pipecraft-Ecosystem-2EAADC)](https://www.pipecraft.net)
[![UTags Offcial Site](https://img.shields.io/badge/UTags-Offcial_Site-brightgreen)](https://utags.link)
