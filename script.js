(function ($) {
    $(document).ready(function () {
        /* Set the default search category */
        setDefaultSearchCategory();

        /* Initialize the welcoming popup */
        initPopup();

        /* Initialize the cart emptyness check */
        initCartCheck();

        /* Initialize the cart emptyness check when the user adds products to an empty cart */
        $( document.body ).on( 'added_to_cart', function(){
            initCartCheck();
        });


        function setDefaultSearchCategory() {
            const Selector = {
                ELEMENT: 'select[name="product_cat"]',
                VALUE: 'accessories',
            }

            $(Selector.ELEMENT).val(Selector.VALUE);
        }

        function initPopup () {

            /* First get the user IP */
            $.getJSON("https://api.ipify.org/?format=json", function(data) {
                const baseUrl = 'http://api.ipstack.com/';
                const userIp = data.ip;
                const apiKey = '?access_key=d42c72af6f784c8cbe3767074abbb68e';
                const locationAccessUrl = baseUrl + userIp + apiKey;


                /* Then proceed to get the location data */
                $.getJSON(locationAccessUrl, function(locationData) {
                    const PopupComponents = {
                        GREETING: 'Hello, dear visitor from ' + locationData.country_name + '!',
                    }

                    let popupStructure = new Popup(PopupComponents.GREETING);

                    setTimeout(function() {
                        $('body').append(popupStructure);
                    }, 5000);

                }).fail(function() {
                    console.log('Error: could not fetch the location data based on the IP address.')
                });

            }).fail(function() {
                console.log('Error: could not fetch the user IP address.')
            });

        }

        function initCartCheck () {
            const $cartElement = $('.fa-shopping-cart');
            const $counterElement = $cartElement.find('.count');
            const $checkoutBtn = $('<a class="speero-CheckoutBtn" href="/checkout/">Pay now</a>')

            if($counterElement.text() > 0) {
                $cartElement.addClass('hasContent');

                $('body').append($checkoutBtn);
            }
        }

        class Popup {
            constructor(text) {
                this.wrapper = $('<div class="speero-Popup"></div>');
                this.overlay = $('<div class="speero-Popup_overlay"></div>');
                this.popupMain = $('<div class="speero-Popup_main"></div>');
                this.popupCloseBtn = $('<a href="#" class="speero-Popup_close"></a>');
                this.popupContent = $('<div class="speero-Popup_content"></div>');
                this.popupText = text;
                this.hidePopupAction([this.overlay, this.popupCloseBtn], this.wrapper);

                this.popupContent.text(this.popupText);
                this.popupMain.append(this.popupCloseBtn, this.popupContent);
                this.wrapper.append(this.overlay, this.popupMain);

                return this.wrapper;
            }

            hidePopupAction (closeElements, $closeTarget) {
                closeElements.forEach(function ($theElement) {
                    $theElement.click(function() {
                        $closeTarget.addClass('hide');
                    });
                });
            }
        }
    });
})(jQuery);