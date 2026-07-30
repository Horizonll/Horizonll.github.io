---
layout: default
image: /img/1.webp
---

<section id="about" class="site-section" markdown="1">
<div class="profile">
  <div class="profile-photo">
    <img
      src="{{ '/img/1.webp' | relative_url }}"
      width="256"
      height="256"
      alt="Ruize He"
      loading="eager"
      fetchpriority="high"
      decoding="async"
    >
  </div>
  <div class="profile-info">
    <h1 class="name">{{ site.author_profile.name }} <span lang="zh-cn">「{{ site.author_profile.alternate_name }}」</span></h1>
    <p class="meta">Undergraduate Student, {{ site.author_profile.affiliation }}</p>
    <div class="profile-links">
      <a href="mailto:{{ site.author_profile.email }}" title="Email {{ site.author_profile.email }}">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z"/><path d="m22 6-10 7L2 6"/></svg>
        <span>Email</span>
      </a>
      <a href="https://github.com/{{ site.author_profile.github }}" target="_blank" rel="noopener noreferrer">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.4 5.4 0 0 0 19.3 4 5 5 0 0 0 19.2.5S18 0 15 2a13.4 13.4 0 0 0-7 0C5 .1 3.8.5 3.8.5A5 5 0 0 0 3.7 4a5.4 5.4 0 0 0-1.5 3.7c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 8 18v4"/><path d="M8 19c-3 .9-3-1.5-4-2"/></svg>
        <span>GitHub</span>
      </a>
      <a href="{{ site.author_profile.scholar }}" target="_blank" rel="noopener noreferrer">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5Z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
        <span>Scholar</span>
      </a>
    </div>
  </div>
</div>

I am an undergraduate student at [Tsinghua University](https://www.tsinghua.edu.cn){:target="_blank" rel="noopener noreferrer"}. I have conducted research on foundation model architecture at [LEAP Lab](https://www.leaplab.ai){:target="_blank" rel="noopener noreferrer"}. I also served as the Decision Team Leader of the THMOS humanoid robotics team. My research interests include foundation model architecture and Test-Time Training.
</section>

<section id="news" class="site-section" markdown="1">
## News

{% include news.html %}
</section>

<section id="education" class="site-section" markdown="1">
## Education

{% include logo-list.html items=site.data.educations %}
</section>

<section id="publications" class="site-section" markdown="1">
## Publications

[Google Scholar]({{ site.author_profile.scholar }}){:target="_blank" rel="noopener noreferrer"}

{% include publications.html %}
</section>

<section id="internships" class="site-section" markdown="1">
## Internships

{% include logo-list.html items=site.data.internships %}
</section>

<section id="awards" class="site-section" markdown="1">
## Awards and Honors

### 2025

- RoboCup 2025 Humanoid League KidSize — 2nd Place
- RoboCup 2025 Humanoid League AdultSize — 4th Place
- RoboCup China Open 2025 Humanoid League — Champion
- Toyota × Future Mobility Innovation Challenge — 1st Prize
- Challenge Cup — 2nd Prize
- Friends of Tsinghua — Tsingyan Huake Scholarship

### 2024

- RoboCup 2024 Humanoid League KidSize — Top 8
- RoboCup China Open 2024 Humanoid League — Champion
- Global Campus AI Algorithm Elite Competition, China — 1st Prize
- Global Campus AI Algorithm Elite Competition, Beijing — 1st Place
- Intelligent Vehicle Competition — 1st Prize
- Intelligent Vehicle Competition — Excellence Award
- Hardware Design Competition, People's Livelihood Track — 1st Prize
- Hardware Design Competition — 3rd Prize
- Chen Xiaoyue Scholarship
</section>

<section id="talks" class="site-section" markdown="1">
## Talks

- "Perception and Decision-Making in Humanoid Soccer Robots", Spark Day, 2025
- "Text-Guided Visual Understanding in Multimodal Large Models", 2025
</section>

<section id="teaching" class="site-section" markdown="1">
## Teaching

- Humanoid Soccer Robot, Teaching Assistant, Fall 2025
- Intelligent Car, Teaching Assistant, Spring 2025
- Humanoid Soccer Robot, Teaching Assistant, Fall 2024
- Exploration of Scientific Research in the Lab, Teaching Assistant, Fall 2024
</section>

<section id="service" class="site-section" markdown="1">
## Professional Service

- Decision Team Leader, THMOS
- Referee, The World Humanoid Robot Games
</section>
