import axios from "axios";

import { deleteBtns, showPageDeleteBtns } from "./_model";
import { displayFlash } from "./_display-alert";

const deletePost = () => {
  if (deleteBtns.length === 0 && showPageDeleteBtns.length === 0) return;

  function deletePost(deleteBtn) {
    deleteBtn.addEventListener("click", async () => {
      try {
        const _id = deleteBtn.dataset._id;
        console.log(_id);
        const response = await axios({
          method: "DELETE",
          url: `/blog/delete/${_id}`,
        });

        console.log(response);

        if (response.status === 204) {
          displayFlash("success", "Post rimosso con successo");

          setTimeout(() => {
            window.location.href = "/blog";
          }, 3000);
        } else
          throw new Error(
            "Qualcosa è andato storto nell'eliminazione del post!"
          );
      } catch (err) {
        displayFlash("error", err.message);
      }
    });
  }

  if (deleteBtns.length !== 0) deleteBtns.forEach(deletePost);
  else showPageDeleteBtns.forEach(deletePost);
};

export default deletePost;
