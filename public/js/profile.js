$(document).ready(() => {
	loadPost();
});

async function loadPost() {
	const posts = await axios.get("/api/post", {
		params: { postedBy: profileUserId }, // this how we send params
	});

	for (let post of posts.data) {
		const html = await createPostHtml(post);
		$(".userPostsContainer").prepend(html);
	}
}
