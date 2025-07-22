// import { execa } from 'execa'
import path from 'path'
// import slash from 'slash'

const MAXIMUM_BITRATE_720P = 5 * 10 ** 6
const MAXIMUM_BITRATE_1080P = 8 * 10 ** 6
const MAXIMUM_BITRATE_1440P = 16 * 10 ** 6

const runFFprobe = async (args: string[]) => {
  const { execa } = await import('execa')
  const { stdout } = await execa('ffprobe', args)
  return stdout.trim()
}

export const checkVideoHasAudio = async (filePath: string) => {
  const slash = (await import('slash')).default
  const stdout = await runFFprobe([
    '-v',
    'error',
    '-select_streams',
    'a:0',
    '-show_entries',
    'stream=codec_type',
    '-of',
    'default=nw=1:nk=1',
    slash(filePath)
  ])
  return stdout === 'audio'
}

const getBitrate = async (filePath: string) => {
  const slash = (await import('slash')).default
  const stdout = await runFFprobe([
    '-v',
    'error',
    '-select_streams',
    'v:0',
    '-show_entries',
    'stream=bit_rate',
    '-of',
    'default=nw=1:nk=1',
    slash(filePath)
  ])
  return Number(stdout)
}

const getResolution = async (filePath: string) => {
  const slash = (await import('slash')).default
  const stdout = await runFFprobe([
    '-v',
    'error',
    '-select_streams',
    'v:0',
    '-show_entries',
    'stream=width,height',
    '-of',
    'csv=s=x:p=0',
    slash(filePath)
  ])
  const [width, height] = stdout.split('x').map(Number)
  return { width, height }
}

const getWidth = (targetHeight: number, original: { width: number; height: number }) => {
  const width = Math.round((targetHeight * original.width) / original.height)
  return width % 2 === 0 ? width : width + 1
}

type EncodeByResolution = {
  inputPath: string
  isHasAudio: boolean
  resolution: { width: number; height: number }
  outputSegmentPath: string
  outputPath: string
  bitrate: {
    720: number
    1080: number
    1440: number
    original: number
  }
}

const encodeHLS = async (
  resolutionLevels: Array<{ height: number; label: keyof EncodeByResolution['bitrate'] }>,
  { inputPath, isHasAudio, outputPath, outputSegmentPath, bitrate, resolution }: EncodeByResolution
) => {
  const slash = (await import('slash')).default
  const args: string[] = [
    '-y',
    '-i',
    slash(inputPath),
    '-preset',
    'veryslow',
    '-g',
    '48',
    '-crf',
    '17',
    '-sc_threshold',
    '0'
  ]

  // Map streams
  for (let i = 0; i < resolutionLevels.length; i++) {
    args.push('-map', '0:0')
    if (isHasAudio) args.push('-map', '0:1')
  }

  // Resolutions & bitrates
  resolutionLevels.forEach((level, index) => {
    const width = getWidth(level.height, resolution)
    args.push('-s:v:' + index, `${width}x${level.height}`)
    args.push('-c:v:' + index, 'libx264')
    args.push('-b:v:' + index, bitrate[level.label].toString())
  })

  args.push('-c:a', 'copy')

  const varStreamMap = resolutionLevels.map((_, i) => (isHasAudio ? `v:${i},a:${i}` : `v:${i}`)).join(' ')
  args.push('-var_stream_map', varStreamMap)

  args.push(
    '-master_pl_name',
    'master.m3u8',
    '-f',
    'hls',
    '-hls_time',
    '6',
    '-hls_list_size',
    '0',
    '-hls_segment_filename',
    slash(outputSegmentPath),
    slash(outputPath)
  )

  const { execa } = await import('execa')
  await execa('ffmpeg', args, { stdio: 'inherit' })
  return true
}

export const encodeHLSWithMultipleVideoStreams = async (inputPath: string) => {
  const [bitrate, resolution] = await Promise.all([getBitrate(inputPath), getResolution(inputPath)])

  const parentFolder = path.dirname(inputPath)
  const outputSegmentPath = path.join(parentFolder, 'v%v/fileSequence%d.ts')
  const outputPath = path.join(parentFolder, 'v%v/prog_index.m3u8')

  const bitrate720 = Math.min(bitrate, MAXIMUM_BITRATE_720P)
  const bitrate1080 = Math.min(bitrate, MAXIMUM_BITRATE_1080P)
  const bitrate1440 = Math.min(bitrate, MAXIMUM_BITRATE_1440P)
  const isHasAudio = await checkVideoHasAudio(inputPath)

  const availableResolutions: {
    height: number
    label: 720 | 1080 | 1440 | 'original'
  }[] = []

  if (resolution.height > 1440) {
    availableResolutions.push(
      { height: 720, label: 720 },
      { height: 1080, label: 1080 },
      { height: resolution.height, label: 'original' }
    )
  } else if (resolution.height > 1080) {
    availableResolutions.push({ height: 720, label: 720 }, { height: 1080, label: 1080 }, { height: 1440, label: 1440 })
  } else if (resolution.height > 720) {
    availableResolutions.push({ height: 720, label: 720 }, { height: 1080, label: 1080 })
  } else {
    availableResolutions.push({ height: 720, label: 720 })
  }

  await encodeHLS(availableResolutions, {
    inputPath,
    isHasAudio,
    outputPath,
    bitrate: {
      720: bitrate720,
      1080: bitrate1080,
      1440: bitrate1440,
      original: bitrate
    },
    resolution,
    outputSegmentPath
  })

  return true
}
