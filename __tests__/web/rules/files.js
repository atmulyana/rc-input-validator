/**
 * https://github.com/atmulyana/rc-input-validator
 */
export default class File {
    constructor(name, type, size) {
        this.name = name;
        this.type = type;
        this.size = size;
    }
}

export const file0 = new File('file', 'octet-stream', 0);
export const txt900 = new File('doc.txt', 'text/plain', 900);
export const ico1000 = new File('icon.ico', 'image/ico', 1000);
export const xml2K = new File('doc.xml', 'text/xml', 2 * 1024);
export const html3K = new File('doc.html', 'text/html', 3 * 1024);
export const pdf4K = new File('doc.pdf', 'application/pdf', 4 * 1024);
export const png5M = new File('image.png', 'image/png', 5 * 1024 * 1024);
export const avi2G = new File('video.avi', 'video/avi', 2 * 1024 * 1024 * 1024);