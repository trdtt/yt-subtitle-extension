$(document).ready(async function () {
    // get the current url & title from tab
    let tab = await browser.tabs.query({currentWindow: true, active: true}).then(tabs => tabs[0])
    const isYtUrl = new RegExp('(youtu.*be.*).com/watch')

    $('#download-button').prop('disabled', true)

    if (isYtUrl.test(tab.url)) {
        let title = tab.title.substring(0, 19) + '...';
        $('#text-cell').text('Download subitles from')
        $('#yt-title').text(title)
    } else {
        $('#text-cell').text('No Youtube video found')
        $('#lang-button').prop('disabled', true)
    }

    $('#lang-dropdown a').on('click', function () {
        let txt = ($(this).text())
        $('#lang-button').html(txt)

        $('#download-button').prop('disabled', false)
    })

    $('#download-button').on('click', function () {
        $('#lang-button').prop('disabled', true)
        $(this).prop('disabled', true)
        $(this).html(
            `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
        )


        let lang = langCode($('#lang-button').text())

        // convert data to MultiDict -> needed for backend specification
        let formData = new FormData();
        formData.append('video_id', tab.url)
        formData.append('lang', lang)

        fetch('https://yt-subtitles.lremane.xyz/data_input', {
            method: "POST",
            body: formData
        })
            .then(res => res.blob())
            .then(async blob => {
                const text = await new Response(blob).text()
                download(text, `${tab.title}.txt`)
            })
    })
})

function download(text, filename) {
    let element = document.createElement('a')

    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURI(text))
    element.setAttribute('download', filename)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
}

function langCode(lang) {
    if (lang === 'German')
        return 'de'
    else if (lang === 'English')
        return 'en'
}