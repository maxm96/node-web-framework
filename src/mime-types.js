/** @module mimeTypes
 * Provides common mime types.
 */

module.exports.defaultMimeType = 'application/octet-stream'

module.exports.mimeTypes = {
  /** text **/
  '.txt': 'text/plain',
  '.html': 'text/html',
  '.htm': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.csv': 'text/csv',
  '.ics': 'text/calendar',
  '.xml': 'text/xml',
  /** font **/
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  /** image **/
  '.bmp': 'image/bmp',
  '.gif': 'image/gif',
  '.ico': 'image/vnd.microsoft.icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.tif': 'image/tiff',
  '.tiff': 'image/tiff',
  '.webp': 'image/webp',
  /** audio **/
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  /** video **/
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  /** application **/
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.json': 'application/json',
  '.jsonld': 'application/ld+json',
  '.odp': 'application/vnd.oasis.opendocument.presentation',
  '.ods': 'application/vnd.oasis.opendocument.spreadsheet',
  '.odt': 'application/vnd.oasis.opendocument.text',
  '.pdf': 'application/pdf',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.tar': 'application/x-tar',
  '.xml': 'application/xml',
  '.xhtml': 'application/xhtml+xml',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.zip': 'application/zip',
}