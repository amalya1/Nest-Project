export const AppError = {
  USER_EXIST: 'User with this email exist.',
  USER_CREATED: 'User created successfully.',
  USER_NOT_EXIST: 'User with this email not exist.',
  WRONG_DATA: 'Wrong data.',
  WRONG_DURATION: 'The uploaded video is less than 2 minutes in duration.',
  WRONG_TYPE: 'The uploaded video must be in .mp4, .avi, .mkv format..',
  FILE_DOES_NOT_EXIST: 'File does not exist:',
  ERROR_FFMPEG: 'Error during ffmpeg command.',
  ERROR_FFPROBE: 'Error executing ffprobe.',
  VIDEO_SAVED: "'Video successfully saved'.",
  ERROR_SECOND_TRIMMING: 'Error during second segment trimming.',
  ERROR_FIRST_TRIMMING: 'Error during first segment trimming.',
};
