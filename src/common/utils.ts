export const getMimeType = (fileExt: string) => {
  let mimeType = 'application/octet-stream';
  switch (fileExt) {
    case 'jpg':
    case 'jpeg':
      mimeType = 'image/jpeg';
      break;
    case 'png':
      mimeType = 'image/png';
      break;
    case 'pdf':
      mimeType = 'application/pdf';
      break;
    case 'txt':
      mimeType = 'text/plain';
      break;
    case 'md':
      mimeType = 'text/markdown';
      break;
    case 'doc':
      mimeType = 'application/msword';
      break;
    case 'docx':
      mimeType =
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      break;
    case 'xls':
      mimeType = 'application/vnd.ms-excel';
      break;
    case 'xlsx':
      mimeType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      break;
    case 'ppt':
      mimeType = 'application/vnd.ms-powerpoint';
      break;
    case 'pptx':
      mimeType =
        'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      break;
    case 'jsonl':
      mimeType = 'application/jsonl';
      break;
    case 'csv':
      mimeType = 'text/csv';
      break;
    case 'eml':
      mimeType = 'message/rfc822';
      break;
    default:
      break;
  }
  return mimeType;
};
