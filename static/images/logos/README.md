# Conference Logos

This directory contains logos for conferences that FikaWorks supports and sponsors.

## Adding Conference Logos

To replace the placeholder text with actual logos:

1. **Download logos** for each conference:
   - KCD Utrecht
   - KCD Amsterdam
   - KCD Romania
   - DevOps Days Amsterdam
   - Kubetrain
   - Kuberoke
   - Cloud Native Rejekts Europe
   - Cloud Native Netherlands

2. **Save logos** in this directory with descriptive names:
   - `kcd-utrecht.png` (or .svg)
   - `kcd-amsterdam.png`
   - `kcd-romania.png`
   - `devopsdays-amsterdam.png`
   - `kubetrain.png`
   - `kuberoke.png`
   - `cloud-native-rejekts.png`
   - `cloud-native-netherlands.png`

3. **Update the layout** at `layouts/community/list.html`:
   - Replace the placeholder `<span>` elements with `<img>` tags
   - Example:
     ```html
     <div class="flex items-center justify-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm w-full h-24">
       <img src="/images/logos/kcd-utrecht.png" alt="KCD Utrecht" class="max-h-16 max-w-full object-contain" />
     </div>
     ```

## Recommended Logo Specifications

- **Format**: PNG or SVG (SVG preferred for scalability)
- **Size**: Maximum height of 100px
- **Background**: Transparent or white
- **Aspect ratio**: Maintain original aspect ratio
- **File size**: Keep under 50KB for optimal loading

## Where to Find Logos

- **KCD**: https://github.com/cncf/artwork/tree/master/projects/kubernetes/community-day
- **DevOps Days**: https://devopsdays.org/events/
- **Cloud Native Netherlands**: Contact organizers
- **Other conferences**: Check official conference websites or press kits
