<div align="center">
    <img src="https://github.com/recurss/recurss.github.io/raw/master/images/title.png"></img>
    <p>A collection of recursive css specimens</p>
</div>

# About

Recurss is a collection of recursive css specimens. These specimens work by styling pages that contain nothing but nested divs:


```html
<div>
    <div>
        <div>
            ...
        </div>
    </div>
</div>
```

Some surprisingly interesting patterns can be created by styling these nested divs. Take a look at the site to see [the latest examples][site].


# Submitting
Submissions to the Recurss collection are highly welcome. Take a look at [how some of the existing specimens are implemented](https://github.com/recurss/recurss.github.io/tree/master/_posts) for inspiration.

**Specimens guidelines**:

* Must make use of recursion.
* No external resources (data uris ok).

## Creating a new specimen

**Get Started**
1. [Install Jekyll](https://jekyllrb.com)

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository.

1. Open your fork locally

1. Create a branch to work on: `git checkout -b new-specimen`

1. Start Jekyll: `jekyll serve`

    You can now browse a local copy of Recurss on http://localhost:4000

**Creating a new specimen**

1. Now to add your specimens. Copy the file `_posts/2018-01-01-template.txt`. Name it with the current date and the title of your specimen. Dates are in the form: Year-Month-Day

1. In your new file, remove the line reading `published: false # Remove this line!!!`

1. In your new file, also fill in the `title`, `date`, and `author` info.

1. (Optional) Also fill in the `settings` section:

    - `max` — Maximum value or recursions
    - `start` — Starting number of recursions on page load
    - `autoplay` — 0 or 1. Should recursions start playing when the page is loaded?`

1. Now write your css in the main body of the page. You can view your page on http://localhost:4000 while developing it.

1. One you are happy with your specimen, take a png screenshot of it. Name the screenshot the same as your post (except with `.png` instead of `.txt`) and add the screenshot file in the `previews` directory

    Please make sure you screenshot:

    - Does not include any browser chrome.
    - Is at most 1200px wide.

**Submitting your specimen**

1. Commit your specimen and the screenshot. Push your branch to github.

1. [Open a pull request](https://help.github.com/articles/about-pull-requests/) from your branch against `master` in the `recurss.github.io` repo.

1. We'll merge your PR and publish it to the site as soon as we are able to review it.

[site]: https://recurss.github.io