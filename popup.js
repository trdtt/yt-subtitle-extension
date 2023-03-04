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

        $.post('https://yt-subtitles.lremane.xyz/data_input',
            {
                video_id: tab.url,
                lang: langCode($('#lang-button').text())
            },
            function (data, status) {
                if (data['status'] === 'successful')
                    download(data['subtitles'], tab.title)
            })
    })
})

function download(subtitles, title) {
    const element = document.createElement('a')
    const file = new Blob([subtitles], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = title + '.txt'
    document.body.appendChild(element)
    element.click()
}

function langCode(lang) {
    if (lang === 'German')
        return 'de'
    else if (lang === 'English')
        return 'en'
}