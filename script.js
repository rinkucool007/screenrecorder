document.addEventListener('DOMContentLoaded', () => {
    const startRecordingBtn = document.getElementById('startRecording');
    const stopRecordingBtn = document.getElementById('stopRecording');
    const screenVideo = document.getElementById('screenVideo');
    const speedControl = document.getElementById('speedControl');

    let mediaRecorder;
    let recordedChunks = [];
    let playbackRate = 1;

    startRecordingBtn.addEventListener('click', startRecording);
    stopRecordingBtn.addEventListener('click', stopRecording);
    speedControl.addEventListener('change', changePlaybackSpeed);

    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: { mediaSource: 'screen' },
                audio: true,
            });

            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                screenVideo.src = url;
            };

            mediaRecorder.start();
            startRecordingBtn.disabled = true;
            stopRecordingBtn.disabled = false;
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    }

    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            startRecordingBtn.disabled = false;
            stopRecordingBtn.disabled = true;
        }
    }

    function changePlaybackSpeed() {
        playbackRate = parseFloat(speedControl.value);
        if (screenVideo) {
            screenVideo.playbackRate = playbackRate;
        }
    }
});
