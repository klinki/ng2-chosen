# ng2-chosen

An angular2 implementation of Chosen ( Not a wrapper )

The current implementation is far from being complete  .. Work on progress

To execute the example .. run the followings commands : 

* `npm install` to install Node packages
* `bower install` to install Bower packages ( chosen is imported to use its CSS )
* `ng serve`

## Currently supported options
  
| Option | Default |  Description |
| --- | --- | --- |
| allow_single_deselect | false | When set to `true` on a single select, Chosen adds a UI element which selects the first element (if it is blank). |
| disable_search | false | When set to true, Chosen will not display the search field (single selects only). |
| disable_search_threshold | 0 | Hide the search input on single selects if there are n or fewer options. |
| max_selected_options | Infinity | Limits how many options the user can select. When the limit is reached, the `maxselected` event is triggered.|
| no_results_text | "No results match"| The text to be displayed when no matching results are found. The current search is shown at the end of the text (e.g., No results match "Bad Search").|
| placeholder_text_multiple | "Select Some Options" | The text to be displayed as a placeholder when no options are selected for a multiple select.|
| placeholder_text_single | "Select an Option" | The text to be displayed as a placeholder when no options are selected for a single select.|
| single_backstroke_delete |true|By default, pressing delete/backspace on multiple selects will remove a selected choice. When false, pressing delete/backspace will highlight the last choice, and a second press deselects it.|
| display_selected_options | true | By default, Chosen includes selected options in search results with a special styling. Setting this option to false will hide selected results and exclude them from searches. Note: this is for multiple selects only. In single selects, the selected result will always be displayed.|

 
 

