import { Cloudinary } from '@cloudinary/url-gen'
import { fill } from '@cloudinary/url-gen/actions/resize'
import { format, quality } from '@cloudinary/url-gen/actions/delivery'
import { auto as fAuto } from '@cloudinary/url-gen/qualifiers/format'
import { auto as qAuto } from '@cloudinary/url-gen/qualifiers/quality'

const cld = new Cloudinary({
    cloud: {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    }
})

export default cld


export const getImgURL = (publicId: string, width: number, height?: number): string => {
    const url = cld.image(publicId).resize(fill().width(width)).delivery(format(fAuto())).delivery(quality(qAuto())).toURL()
    return url
}

