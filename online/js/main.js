const Utils = await (async function() {
    const STYLES = {
        BANNER_LABEL: "position:absolute;height:150px;width:150px;left:-7px;top:-7px;overflow:hidden;text-align:center;",
        BANNER_INNER: "position:relative;height:35px;left:-35px;transform:rotate(-45deg);background-color:red;top:40px;color:white;width:190px;line-height:35px;font-weight:bold;",
        NEW: "font-size:20px;",
        LIMITED: "font-size:15px;",
        createBanner
    };

    function createBanner() {
        const d = document.createElement("div");
        d.setAttribute("style", STYLES.BANNER_LABEL);

        const d2 = document.createElement("div");
        d2.setAttribute("style", STYLES.BANNER_INNER);

        const s = document.createElement("span");
        s.setAttribute("style", STYLES.NEW);
        s.innerText="NEW";
        d2.appendChild(s);
        d.appendChild(d2);

        return d;
    }

    

    const OPTIONS =  {
        Date: new Date(),
        NEW_DAYS: 14,
        TRY: 0,
        JSON: null
    };

    async function fetchJSON(url) {
        try {
            const f = await fetch(url);
            if (!f.ok)
                throw new Error("Fetch JSON data error");

            return await f.json();
        } catch(e) {
            console.error(`Error with fetching JSON data: ${e}`);
        }
    }
    OPTIONS.JSON = await fetchJSON("https://cdn5.editmysite.com/app/store/api/v28/editor/users/151241360/sites/544826886661440579/products?per_page=200&page=1");

    function loadBanners() {
        setTimeout(()=>{
            OPTIONS.TRY+=1;
            const products = document.getElementsByClassName("figure__aspect-ratio");
            if (products.length>0) {
                let d1 = new Date();
                d1.setDate(d1.getDate() - OPTIONS.NEW_DAYS);
                if (OPTIONS.JSON.data!=null) {
                    console.log("Data: ",OPTIONS.JSON.data);
                    OPTIONS.JSON.data.forEach(p=>{
                        let d2 = new Date(p.created_date);
                        if (d2>=d1) {
                            for (let i=0; i<products.length; i++) {
                                if (p.name == products[i].children[1].getAttribute("alt")) {
                                    const b = createBanner();
                                    products[i].children[0].appendChild(b);
                                    break;
                                }
                            }

                            if (window.location.href.includes("/product/")) {
                                console.log(`Does image/${p.seo_product_image_id} exsits?`);
                                if (document.getElementById(`image/${p.seo_product_image_id}`)!=null) {
                                    console.log(`Getting image/${p.seo_product_image_id}`);
                                    const img = document.getElementById(`image/${p.seo_product_image_id}`);
                                    const b = createBanner();
                                    img.appendChild(b);
                                }
                            }
                        }
                    });
                }
                
                
            } else if (OPTIONS.TRY<=6)
                loadBanners();
        }, 500);
    }

    function setDeliveryTime() {
        setTimeout(() => {
            if (window.location.pathname.startsWith("/s/cart")) {
                const a = document.getElementsByClassName("cart-fulfillment-header");
                if (a.length > 0) {
                    a[0].children[1].children[0].innerText = "Change Delivery Time";
                    if (!OPTIONS.shownTimes) {
                        a[0].children[1].children[0].click();
                        OPTIONS.shownTimes = true;
                    }
                } else setDeliveryTime();
            }
        }, 1000);
    }

    function onPageUpdate() {
        OPTIONS.TRY=0;
        loadBanners();
        setDeliveryTime();
    }

    return {
        loadBanners,
        onPageUpdate
    }
})();

(function(h){
	const ps = h.pushState;
	const rs = h.replaceState;
	
	h.pushState = function() {
		ps.apply(h, arguments);
		Utils.onPageUpdate();
	};
	h.replaceState = function() {
		rs.apply(h, arguments);
		Utils.onPageUpdate();
	};
	window.addEventListener("popstate", Utils.onPageUpdate);
})(window.history);

document.addEventListener("DOMContentLoaded", async function() {
    Utils.loadBanners();
});
