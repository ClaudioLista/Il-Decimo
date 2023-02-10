document.querySelectorAll(".feedback li").forEach((entry) =>
    entry.addEventListener("click", (e) => {
      //console.log(entry);
      if (!entry.classList.contains("active")) {
        let activeNOW = document.querySelector(".feedback li.active");
        activeNOW.classList.remove("active");
        const old = activeNOW.classList[0]

        switch (activeNOW.classList[0]) {
          case "angry":
            let counter1 = document.getElementById("counterAngry").innerHTML;
            counter1 = parseInt(counter1) - 1;
            document.getElementById("counterAngry").innerHTML = counter1;
            break;
          case "sad":
            let counter2 = document.getElementById("counterSad").innerHTML;
            counter2 = parseInt(counter2) - 1;
            document.getElementById("counterSad").innerHTML = counter2;
            break;
          case "ok":
            let counter3 = document.getElementById("counterOk").innerHTML;
            counter3 = parseInt(counter3) - 1;
            document.getElementById("counterOk").innerHTML = counter3;
            break;
          case "good":
            let counter4 = document.getElementById("counterGood").innerHTML;
            counter4 = parseInt(counter4) - 1;
            document.getElementById("counterGood").innerHTML = counter4;
            break;
          case "happy":
            let counter5 = document.getElementById("counterHappy").innerHTML;
            counter5 = parseInt(counter5) - 1;
            document.getElementById("counterHappy").innerHTML = counter5;
            break;
          default:
            break;
        }

        entry.classList.add("active");

        switch (entry.classList[0]) {
          case "angry":
            let counter1 = document.getElementById("counterAngry").innerHTML;
            counter1 = parseInt(counter1) + 1;
            document.getElementById("counterAngry").innerHTML = counter1;
            break;
          case "sad":
            let counter2 = document.getElementById("counterSad").innerHTML;
            counter2 = parseInt(counter2) + 1;
            document.getElementById("counterSad").innerHTML = counter2;
            break;
          case "ok":
            let counter3 = document.getElementById("counterOk").innerHTML;
            counter3 = parseInt(counter3) + 1;
            document.getElementById("counterOk").innerHTML = counter3;
            break;
          case "good":
            let counter4 = document.getElementById("counterGood").innerHTML;
            counter4 = parseInt(counter4) + 1;
            document.getElementById("counterGood").innerHTML = counter4;
            break;
          case "happy":
            let counter5 = document.getElementById("counterHappy").innerHTML;
            counter5 = parseInt(counter5) + 1;
            document.getElementById("counterHappy").innerHTML = counter5;
            break;
          default:
            break;
        }
        
        fetch("/vote-match/", {
            method: "POST",
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'X-CSRF-TOKEN': "<%= csrfToken %>"
            },
            body: JSON.stringify({ matchId: "<%= m._id %>", op: "add", oldVote: old, newVote: entry.classList[0]}),
        })

      } else {
        entry.classList.remove("active");
        document.getElementById("noneVote").classList.add("active");

        switch (entry.classList[0]) {
          case "angry":
            let counter1 = document.getElementById("counterAngry").innerHTML;
            counter1 = parseInt(counter1) - 1;
            document.getElementById("counterAngry").innerHTML = counter1;
            break;
          case "sad":
            let counter2 = document.getElementById("counterSad").innerHTML;
            counter2 = parseInt(counter2) - 1;
            document.getElementById("counterSad").innerHTML = counter2;
            break;
          case "ok":
            let counter3 = document.getElementById("counterOk").innerHTML;
            counter3 = parseInt(counter3) - 1;
            document.getElementById("counterOk").innerHTML = counter3;
            break;
          case "good":
            let counter4 = document.getElementById("counterGood").innerHTML;
            counter4 = parseInt(counter4) - 1;
            document.getElementById("counterGood").innerHTML = counter4;
            break;
          case "happy":
            let counter5 = document.getElementById("counterHappy").innerHTML;
            counter5 = parseInt(counter5) - 1;
            document.getElementById("counterHappy").innerHTML = counter5;
            break;
          default:
            break;
        }

        fetch("/vote-match/", {
            method: "POST",
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'X-CSRF-TOKEN': "<%= csrfToken %>"
            },
            body: JSON.stringify({ matchId: "<%= m._id %>", op: "sub", newVote: entry.classList[0]}),
        })

      }
      e.preventDefault();
    })
  );