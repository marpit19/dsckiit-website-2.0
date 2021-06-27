import { ReactNode, useMemo } from 'react';
import useSWR from 'swr';

import { getUserScore } from '@/lib/dynamicData/userScore';
import useUser from '@/hooks/useUser';
import { getSeasonScore } from '@/lib/dynamicData/seasonScore';
import { getUserBadgesFromArray } from '@/lib/dynamicData/badges';
import type { BadgeDataType } from '@/types/index';

import { Container, Grid, Box, Avatar, Typography, Paper, ButtonBase } from '@material-ui/core';
import useStyles from './styles';

export default function Dashboard() {
	const classes = useStyles();

	const { user } = useUser();

	const { data: userScore } = useSWR(
		`${user?.id}_score`,
		() => (user?.score ? getUserScore(user.score) : null),
		{ refreshInterval: 10 * 1000 }
	);

	const { data: userBadges } = useSWR(
		`${user?.id}_badges`,
		() => (user?.badges ? getUserBadgesFromArray(user.badges) : null),
		{ refreshInterval: 10 * 1000 }
	);

	const { data: seasonScore } = useSWR('season_score', getSeasonScore, {
		refreshInterval: 120 * 1000,
	});

	const profile = useMemo(() => {
		if (user) {
			const joinedOn = user.created_at && new Date(user.created_at).toDateString();
			const username = user.username.toUpperCase();
			return {
				username,
				joinedOn,
				email: user.email,
			};
		}
		return null;
	}, [user]);

	const badgesDisplay = useMemo(() => displayBadges(userBadges, classes), [userBadges]);

	return (
		<div>
			<Container maxWidth="sm" className={classes.container}>
				<Box className={classes.header}>
					<img
						src="/images/dashboard/dscdash.png"
						className={classes.img}
						alt="coverImage"></img>
				</Box>
				<Box className={classes.box}>
					<Avatar className={classes.large}>U</Avatar>
				</Box>
				<Box className={classes.content}>
					<Typography variant="h6" className={classes.name}>
						{profile?.username}
					</Typography>
					<Typography variant="subtitle1" className={classes.name}>
						{profile?.email}
					</Typography>
					<Typography
						variant="h6"
						gutterBottom
						className={classes.location}
						color={'textSecondary'}>
						Joined on <strong>{profile?.joinedOn}</strong>
					</Typography>
				</Box>
				<Grid container item xs={12}>
					<Grid item xs={6}>
						{userScore ? (
							<>
								<Typography
									variant="body2"
									className={classes.name}
									color="textSecondary">
									Your Points
								</Typography>
								<Typography variant="h6" className={classes.name}>
									{userScore}
								</Typography>
							</>
						) : null}
					</Grid>
					<Grid item xs={6}>
						{seasonScore ? (
							<>
								<Typography
									variant="body2"
									className={classes.name}
									color="textSecondary">
									Season Points
								</Typography>
								<Typography variant="h6" className={classes.name}>
									{seasonScore}
								</Typography>
							</>
						) : null}
					</Grid>
				</Grid>
			</Container>
			<div
				style={{
					marginTop: 30,
				}}>
				<h1 style={{ color: '#2f353a', textAlign: 'center' }}>BADGES</h1>
			</div>
			<Container className={classes.c} maxWidth="md">
				<Grid container spacing={2}>
					{badgesDisplay}
				</Grid>
			</Container>
		</div>
	);
}

function displayBadges(userBadges: BadgeDataType[] | null | undefined, classes: any): ReactNode {
	return userBadges?.map((badge) => (
		<div className={classes.badge} key={badge.id}>
			<Paper className={classes.paper}>
				<Grid container direction="row" spacing={2}>
					<Grid item>
						<ButtonBase className={classes.image}>
							<img className={classes.imge} alt={badge.name} src={badge.image.url} />
						</ButtonBase>
					</Grid>
					<Grid item xs={10} sm container>
						<Grid item xs container direction="column" spacing={2}>
							<Grid item xs>
								<Typography style={{ marginTop: 45 }} gutterBottom variant="h5">
									{badge.name.toUpperCase()}
								</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Paper>
		</div>
	));
}
