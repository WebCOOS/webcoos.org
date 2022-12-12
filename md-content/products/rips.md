---
title: Rip Current Detection
classes: max-w-none prose-fix-images
show_product_grid: true
---

<div class='product-title'>
    <img class='rounded-t w-16' src='/rips.svg' alt='' />
    <h1>Rip Current Detection</h1>
</div>


## Project Overview

WebCOOS Principal Investigator Dr. Alex Pang from University of California Santa Cruz, in collaboration with Dr. Greg Dusek from NOAA CO-OPS, is working on rip current detection using two different approaches: (1) flow-based analysis, and (2) machine learning (ML). His work focuses on the continued development of the ML approach but also incorporates as much of the flow-based approach as possible.

Flow-based Analysis: The optical flow map is the underlying basis for flow-based analysis and is generated by analyzing consecutive frames of a video to infer the velocities of surface currents. Our strategy is to apply flow visualization techniques to analyze the optical flow map from the webcam videos. In particular, we explore different methods for analyzing time-varying velocity fields notably timelines, pathlines and streaklines. Timelines are analogous to a chain of virtual buoys and when placed along the shoreline allow visualization of rip channels as seaward protrusions of the timeline. Pathlines trace the trajectory of a virtual untethered buoy over time, while streaklines are effectively virtual dye and are  used to trace the trajectory of a series of particles that are continually injected into the flow from a fixed source.  Flow-based analysis allows us to detect rip currents based on their flow behavior.

<div class="prose-image-with-caption">
    <img src="/img/products/rips/1.png" alt="Rip detection line" />
    <sub>Example of a timeline to indicate rip currents.  The gray line is the initial position of the timeline.  The blue curve is the position of the timeline after some time.  Protrusion of the timeline beyond its original position is indicative of a rip current.</sub>
</div>


### Machine Learning Identification of Rip Currents

This approach is based on training an ML model to recognize rip currents. Thus far, we have used Faster Regions with Convolutional Neural Network (F-RCNN) features trained on hand-labeled still images and tested on expert classified videos including those from two of the WebCAT webcams (Buxton and Miami). Initial results are very promising for rips that are characterized by flanking breaking waves.  We plan to improve rip detection capabilities by (a) adding more training data to recognize other rips with different visual appearances (e.g. those characterized by water discoloration, foam, etc.), and (b) incorporating results from flow-based analysis so that the ML model can also learn to identify rips based on their flow behavior .

<div class="prose-image-with-caption">
    <img src="/img/products/rips/2.png" alt="Beach image" />
    <img src="/img/products/rips/3.png" alt="Rip detection rectangle" />
    <sub>Hampton Inn Camera on a day with no rips detected, and on a day with a rip detected (highlighted by the blue box).</sub>
</div>

## Why this Matters

Real-time detection of rip currents can help inform public safety personnel of potential hazardous conditions, and be used by the National Weather Service when issuing rip current forecasts. Records of rip current occurrence will also support improving the NOAA National Rip Current Model and enable more accurate rip current predictions.

## Products

### Product Types

* **Livestream** with visual overlay of either bounding box(es) or region(s) highlighting location(s) of detected rip currents.
* **Summary image**:  Each 10 minute video will be represented by a summary image showing the time averaged locations of detected rip currents.
* **Time-series of rip detection**: A yes/no if a rip current is detected for each 10 minute video clip.  Users can sign up for notification (text/email) if one or more rip is detected in a clip for a specified camera.
* **Trend Analysis**: after a year of collecting data, trends will be assessed at each camera location to provide the number of rips, duration, month with most rips, etc.

### How should I use these products?

These products can help inform analysis of past conditions and be used by partners to provide insight into real-time conditions. These products should not be used to make decisions whether or not it is safe to swim or enter the water at a particular location.

### What are the limitations?

The methods used may not accurately detect all rip currents, or may incorrectly detect a rip current when one is not present. The methods presently do not discern rip current strength or velocity. The rip current detection methods may not be applied to the entire video frame if resolution or angle limits algorithm functionality. Rip currents can vary dramatically alongshore, so the presence or absence of a rip current in the frame of the video may not be indicative of conditions nearby, but outside of the viewing region.

## Resources & Publications

* Mori, I., A. de Silva, G. Dusek, J. Davis and A. Pang. (2022). Flow-based Rip Current Detection and Visualization. *IEEE Access*. doi: 10.1109/ACCESS.2022.3140340

* de Silva, A., I. Mori, G. Dusek, J. Davis, and A. Pang, (2021). Automated Rip Current Detection with Region based Convolutional Neural Networks. *Coastal Engineerin*g.

## Partners

* NOAA's Center for Operational Oceanographic Products and Services (CO-OPS)
* University of California, Santa Cruz
* NOAA National Weather Service