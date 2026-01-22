document.addEventListener("DOMContentLoaded", () => {
  const likeBtn = document.querySelector(".like-btn");
  const heart = document.querySelector(".heart");
  const likeCountEl = document.getElementById("like-count");

  let likeCount = parseInt(likeCountEl.textContent) || 342;

  likeBtn.addEventListener("click", () => {
    const isNowLiked = heart.classList.toggle("liked");

    if (isNowLiked) {
      likeCount++;
      heart.style.animation = "pop 0.4s ease";
    } else {
      likeCount = Math.max(0, likeCount - 1);
      heart.style.animation = "none";
    }

    likeCountEl.textContent = likeCount;
  });

  const commentBtn = document.querySelector(".comment-btn");
  const commentContainer = document.getElementById("comment-input-container");
  const commentInput = document.getElementById("comment-input");
  const sendBtn = document.getElementById("send-comment");
  const commentsList = document.getElementById("comments-list");

  commentBtn.addEventListener("click", () => {
    const isVisible = commentContainer.style.display !== "none";
    commentContainer.style.display = isVisible ? "none" : "block";

    if (!isVisible) {
      commentInput.focus();
    }
  });

  sendBtn.addEventListener("click", () => {
    const text = commentInput.value.trim();

    if (!text) return;

    const newComment = document.createElement("div");
    newComment.classList.add("comment", "new-comment");

    newComment.innerHTML = `
            <span class="comment-username">toi</span> 
            ${text}
        `;

    commentsList.insertBefore(newComment, commentsList.firstChild);

    commentInput.value = "";
    commentContainer.style.display = "none";
  });

  commentInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendBtn.click();
    }
  });

  const saveBtn = document.querySelector(".save-btn");

  saveBtn.addEventListener("click", () => {
    const img = document.getElementById("post-image");

    const link = document.createElement("a");
    link.href = img.src;
    link.download = "flex_pose_from_i_gonna_lie.jpg";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const icon = saveBtn.querySelector("i");
    icon.classList.remove("fa-regular");
    icon.classList.add("fa-solid");

    setTimeout(() => {
      icon.classList.remove("fa-solid");
      icon.classList.add("fa-regular");
    }, 1200);
  });
});
