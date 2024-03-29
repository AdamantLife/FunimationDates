# TOC
1. [About](#funimationdates)
2. [Sample Images](#images)
3. [Availability & Usage](#availability-and-usage)
4. [How it works](#functionality)

## FunimationDates
FunimationDates is a browser extension which adds Aired Date/Date Added information to a **Show's Homepage** and **Episode Page** on Funimation.com. It also adds an approximate Date/Time to the **New Releases Page**

## Images
<figure>
    <img src="Example.png" />
    <figcaption align="center"><b>Show Homepage</b></figcaption>
</figure>

---

<figure>
    <img src="Example2.png" />
    <figcaption align="center"><b>Episode Page (currently not shown on funimation)</b></figcaption>
</figure>

---

<figure>
    <img src="Example3.png" />
    <figcaption align="center"><b>New Releases</b></figcaption>
</figure>

## Availability and Usage
This extension is not currently available in any Extension/Add-on Store and therefore has to be loaded as an unpacked add-on. You should never install any extension that you do not trust; be sure to review the extension (it's relatively basic) and understand what it does before you choose to install. This section will be updated with distribution links once this extension is available for installation through official channels.

If you do not know how to install an unpacked extension, the quickest solution is to do a web search for the steps needed for your specific browser. Generally, on the extensions/add-on page there will be a checkbox/toggle to allow Developer Mode (or a similar setting) at which point a button will appear with a label similar to "Load an unpacked extension".

## Functionality
When the homepage loads episodes, or the episode page first loads, it makes a request to Funimation's private API for episode information and stores the response. The dates added by this extension are taken directly from that data: this extension makes no API calls of any kind and does no validation or manipulation of the dates aside from formatting them using Date.toLocaleString.

New Releases pages are not dynamically loaded right now, and therefore the only information that is available is the "X days/hours/minutes ago" tag below the image. The Extension parses this line and adjust the current Date accordingly. For releases within 24 hours, the calculated Date will be accurate; after 24 hours, this line no longer includes minutes and therefore only the difference in days and hours can be calculated, resulting in a somewhat inaccurate result. For any shows that were aired more than one year prior, no calculations can be made (as "over x years ago" does not provide enough information), and therefore no release date is added.
