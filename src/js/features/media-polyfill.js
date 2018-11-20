export const getMedia = () => {
    if(!('mediaDevices' in navigator)){
        navigator.mediaDevices = {}
    }

    if(!('getUserMedia' in navigator.mediaDevices)){
        navigator.mediaDevices.getUserMedia = (constraints) => {
            // Old implementations
            let getUserMedia = navigator.webKitGetUserMedia || navigator.mozGetUserMedia

            if(!getUserMedia){
                return Promise.reject('[MEDIA] No mediaDevices supported')
            }
            
            return new Promise((resolve, reject) => (
                getUserMedia.call(navigator, constraints, resolve, reject)
            ))
        }
    }
}