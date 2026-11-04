// Re-crops a cut-out portrait so the face has a set size and position.
// usage: crop <in> <out.png> faceX faceY faceW faceH headTop [target] [margin] [dx] [dy] [size] [gray]
//   target  face height as a share of the output (default 0.55)
//   headTop first row of hair above the face (source pixels)
//   margin  space above the head as a share of the output (default 0.06)
//   dx, dy  manual nudge of the face centre in source pixels (default 0)
//   size    output width and height in pixels (default 800)
//   gray    1 for black and white (default 0)
// Only zooms in. The crop never runs past the bottom or sides of the photo
// (the cut-out body would end in a hard edge); it may run past the top,
// which is transparent.
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let a = CommandLine.arguments
let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: a[1]) as CFURL, nil)!
let img = CGImageSourceCreateImageAtIndex(src, 0, nil)!
let W = Double(img.width), H = Double(img.height)
let fx = Double(a[3])!, fy = Double(a[4])!, fw = Double(a[5])!, fh = Double(a[6])!
let headTop = Double(a[7])!
let target = a.count > 8 ? Double(a[8])! : 0.55
let margin = a.count > 9 ? Double(a[9])! : 0.06
let dx = a.count > 10 ? Double(a[10])! : 0
let dy = a.count > 11 ? Double(a[11])! : 0
let out = a.count > 12 ? Int(a[12])! : 800
let gray = a.count > 13 && a[13] == "1"

var c = min(fh / target, W, H)                 // crop side; never zoom out
let cx = fx + fw / 2 + dx
var x = cx - c / 2
var y = headTop - margin * c + dy
x = max(0, min(x, W - c))                      // no gaps at the sides
y = min(y, H - c)                              // no gap at the bottom

let ctx = CGContext(data: nil, width: out, height: out, bitsPerComponent: 8, bytesPerRow: 0,
                    space: gray ? CGColorSpaceCreateDeviceGray() : CGColorSpaceCreateDeviceRGB(),
                    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.interpolationQuality = .high
let s = Double(out) / c
// CoreGraphics draws from the bottom left; flip the source y.
ctx.draw(img, in: CGRect(x: -x * s, y: -(H - (y + c)) * s, width: W * s, height: H * s))
let dest = CGImageDestinationCreateWithURL(URL(fileURLWithPath: a[2]) as CFURL,
                                           UTType.png.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(dest, ctx.makeImage()!, nil)
CGImageDestinationFinalize(dest)
print(String(format: "%@ crop=%.0f x=%.0f y=%.0f face=%.2f", a[2], c, x, y, fh / c))
