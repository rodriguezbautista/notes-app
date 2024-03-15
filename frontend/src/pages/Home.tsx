import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
	return (
		<>
			<section className="home__section">
				<div className="home__container">
					<h1>
						Capture, Organize, and Remember with <span>Note It Down</span>
					</h1>
					<h2 className="subtitle">
						Effortless Note-taking App for Busy Minds.
					</h2>
					<Link to="/login" className="home__cta">
						Start Now
					</Link>
				</div>
			</section>
			<section className="home__section">
				<div className="home__container home__about">
					<img src="/demo.png" alt="Demo of the app" className="home__image" />
					<div className="home__about-text">
						<p>
							Note It Down is the app where you can store all you want and have
							it organized.
						</p>
						<p>
							Here you can have all of your notes stored with custom categories
							and set their activity status, this will help you to don’t miss
							anything!
						</p>
					</div>
				</div>
			</section>
			<section className="home__section">
				<div className="home__container home__footer">
					<h1>Start Writing Now</h1>
					<Link to="/login" className="home__cta">
						Start Now
					</Link>
				</div>
			</section>
		</>
	);
}

export default Home;
