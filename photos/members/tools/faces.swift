// Measures each photo: image size, face box (Apple Vision) and the box of
// non-transparent pixels (the cut-out person). Prints one JSON line per file.
// Coordinates are in pixels with the origin at the top left.
import Foundation
import Vision
import CoreGraphics
import ImageIO

func load(_ path: String) -> CGImage? {
    guard let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: path) as CFURL, nil) else { return nil }
    return CGImageSourceCreateImageAtIndex(src, 0, nil)
}

func alphaBox(_ img: CGImage, colFrom: Int = 0, colTo: Int = Int.max) -> [Int] {
    let w = img.width, h = img.height
    var data = [UInt8](repeating: 0, count: w * h * 4)
    let ctx = CGContext(data: &data, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4,
                        space: CGColorSpaceCreateDeviceRGB(),
                        bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
    ctx.draw(img, in: CGRect(x: 0, y: 0, width: w, height: h))
    var minX = w, minY = h, maxX = -1, maxY = -1
    for y in 0..<h {
        for x in max(0, colFrom)..<min(w, colTo) where data[(y * w + x) * 4 + 3] > 40 {
            if x < minX { minX = x }; if x > maxX { maxX = x }
            if y < minY { minY = y }; if y > maxY { maxY = y }
        }
    }
    return [minX, minY, maxX, maxY]
}

for path in CommandLine.arguments.dropFirst() {
    guard let img = load(path) else { print("{\"file\":\"\(path)\",\"error\":\"load\"}"); continue }
    let req = VNDetectFaceRectanglesRequest()
    try? VNImageRequestHandler(cgImage: img, options: [:]).perform([req])
    let W = Double(img.width), H = Double(img.height)
    var faces: [[Int]] = []
    for f in req.results ?? [] {
        let b = f.boundingBox  // normalised, origin bottom left
        faces.append([Int(b.minX * W), Int((1 - b.maxY) * H), Int(b.width * W), Int(b.height * H)])
    }
    let a = alphaBox(img)
    // Top of the head: first opaque row above the middle half of the face.
    var headTop = -1
    if let f = faces.first { headTop = alphaBox(img, colFrom: f[0] + f[2] / 4, colTo: f[0] + 3 * f[2] / 4)[1] }
    print("{\"file\":\"\(path)\",\"w\":\(img.width),\"h\":\(img.height),\"faces\":\(faces),\"alpha\":\(a),\"headTop\":\(headTop)}")
}
