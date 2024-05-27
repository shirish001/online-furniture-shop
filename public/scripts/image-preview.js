const imagePickerElement = document.querySelector('#image-upload-control input');
const imagePreviewElement = document.querySelector('#image-upload-control img');

function updateImagePreview() {
  const files = imagePickerElement.files; // returns a list of files(array) selected( the files property)

  if (!files || files.length === 0) { // if after selecting we deselcted the file
    imagePreviewElement.style.display = 'none';
    return;
  }

  const pickedFile = files[0]; // selecting only single element

  // creating a url for the administrators' image that will be added and setting to form img src attribute
  imagePreviewElement.src = URL.createObjectURL(pickedFile);  // URL is a frontend js class having static createObjectURL method
  imagePreviewElement.style.display = 'block';
}

imagePickerElement.addEventListener('change', updateImagePreview); // event that triggers...