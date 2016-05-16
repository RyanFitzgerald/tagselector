/*
    Tag Cloud - A jQuery Tag Cloud Generator
    Version 1.0.0
    Ryan Fitzgerald
    https://RyanFitzgerald.ca/
    ---
    Repo: http://github.com/ryanfitzgerald/tagcloud
    Issues: http://github.com/ryanfitzgerald/tagcloud/issues
    Licensed under MIT Open Source
 */

(function($) {

    $.fn.tagcloud = function(options) {

        // Overide defaults, if provided
        var settings = $.extend({
            max: 1/0
        }, options);

        // Allow chaining and process each DOM node
        return this.each(function() {

            // --- Define Variables ---
            var $this = $(this); // Store reference to self
            var $options = $this.children('option'); // Store select options
            var selected = []; // Create array to store selected values
            var max = settings.max;

            // Create wrapping div
            $this.wrap('<div class="tc-wrapper"></div>');

            // Store reference to parent
            var $parent = $this.parent();

            // Hide original select
            $this.hide();

            // Create tag cloud div
            $this.after('<div class="tc-cloud"></div>')

            // Create tags
            $options.each(function(i) {
                $parent.find('.tc-cloud').append('<span class="tc-tag" data-tag="'+i+'">'+$(this).text()+'</span>');
            });

            // Manage clicks
            $parent.find('.tc-tag').click(function() {

                // Get current tag number
                var tagNum = $(this).data('tag');

                // Check if it is selected or not
                if ($(this).hasClass('tc-selected')) { // If already selected

                    // Remove class
                    $(this).removeClass('tc-selected');

                    // Unselect from select
                    $this.find('option:eq('+tagNum+')').prop('selected', false);

                    // Remove selected value
                    selected.splice($.inArray(tagNum, selected), 1);

                } else { // If not selected

                    // Add class
                    $(this).addClass('tc-selected');

                    // Add selected attribute
                    $this.find('option:eq('+tagNum+')').prop('selected', true);

                    // Push to selected array
                    selected.push(tagNum);

                    // Check if max has been set
                    if (selected.length > max) {

                        // Unselect from select
                        $this.find('option:eq('+selected[0]+')').prop('selected', false);

                        // Remove class
                        $parent.find('.tc-selected[data-tag='+selected[0]+']').removeClass('tc-selected');

                        // Pop first array member
                        selected.shift();

                    }

                }

            });

        });

    }

})(jQuery);
