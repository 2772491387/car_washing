    const packages = {
      daily: {
        title: "日常精洗",
        desc: "适合每周或每两周一次的常规洗护，重点处理灰尘、泥点和车内轻微杂物。",
        price: "¥68",
        features: ["车身高压预洗", "中性泡沫覆盖", "轮毂轮胎清洁", "内饰吸尘整理"]
      },
      deep: {
        title: "深度焕新",
        desc: "适合换季、长途后或车内使用频率较高的车辆，外观与内饰一起恢复清爽。",
        price: "¥198",
        features: ["全车精洗", "内饰分区深洁", "玻璃油膜处理", "车漆上光保护"]
      },
      coat: {
        title: "镀膜守护",
        desc: "适合长期停户外或希望减少后续清洁压力的车主，重点提升抗污和泼水表现。",
        price: "¥398",
        features: ["漆面去污泥", "细节缝隙清洁", "高分子镀膜", "轮胎与外饰件养护"]
      }
    };

    const navLinks = document.querySelector("#navLinks");
    const menuToggle = document.querySelector("#menuToggle");
    const packageTabs = document.querySelectorAll(".package-tab");
    const packageTitle = document.querySelector("#packageTitle");
    const packageDesc = document.querySelector("#packageDesc");
    const packagePrice = document.querySelector("#packagePrice");
    const packageFeatures = document.querySelector("#packageFeatures");
    const bookingForm = document.querySelector("#bookingForm");
    const formMessage = document.querySelector("#formMessage");

    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });

    packageTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const key = tab.dataset.package;
        const item = packages[key];

        packageTabs.forEach((otherTab) => {
          otherTab.classList.toggle("active", otherTab === tab);
          otherTab.setAttribute("aria-selected", String(otherTab === tab));
        });

        packageTitle.textContent = item.title;
        packageDesc.textContent = item.desc;
        packagePrice.innerHTML = `${item.price} <small>起</small>`;
        packageFeatures.innerHTML = item.features.map((feature) => `<li>${feature}</li>`).join("");
        document.querySelector("#service").value = item.title;
      });
    });

    document.querySelectorAll(".faq-question").forEach((button) => {
      button.addEventListener("click", () => {
        button.closest(".faq-item").classList.toggle("open");
      });
    });

    bookingForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      formMessage.textContent = "正在提交预约...";

      const formData = new FormData(bookingForm);
      const payload = Object.fromEntries(formData.entries());

      try {
        const response = await fetch("/api/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error("预约提交失败");
        }

        const result = await response.json().catch(() => ({}));
        const bookingId = result.data && result.data.id ? ` 编号：${result.data.id}` : "";
        formMessage.textContent = `预约已提交，门店稍后联系确认。${bookingId}`;
        bookingForm.reset();
      } catch (error) {
        formMessage.textContent = "预约提交失败，请稍后重试或联系门店。";
      }
    });
