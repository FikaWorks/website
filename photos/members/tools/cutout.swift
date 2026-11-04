// Removes the background from a portrait, like "lift subject" in Photos.
// usage: cutout <in> <out.png>
// Uses Apple Vision's foreground mask (macOS 14 or later). Writes a PNG with
// a transparent background at the original size.
import Foundation
import Vision
import CoreImage
import ImageIO
import UniformTypeIdentifiers

let a = CommandLine.arguments
let url = URL(fileURLWithPath: a[1])
guard let input = CIImage(contentsOf: url, options: [.applyOrientationProperty: true]) else {
    fatalError("cannot read \(a[1])")
}
let req = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(ciImage: input)
try handler.perform([req])
guard let result = req.results?.first else { fatalError("no subject found in \(a[1])") }
let buffer = try result.generateMaskedImage(ofInstances: result.allInstances, from: handler,
                                            croppedToInstancesExtent: false)
let masked = CIImage(cvPixelBuffer: buffer)
let ctx = CIContext()
guard let cg = ctx.createCGImage(masked, from: masked.extent) else { fatalError("render failed") }
let dest = CGImageDestinationCreateWithURL(URL(fileURLWithPath: a[2]) as CFURL,
                                           UTType.png.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(dest, cg, nil)
CGImageDestinationFinalize(dest)
print("\(a[2]) \(cg.width)x\(cg.height)")
