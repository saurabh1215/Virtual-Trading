import React from "react";
import { Typography, Container, Grid, Card, CardMedia, CardContent, Link, Box } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import Axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';
import LaunchIcon from "@material-ui/icons/Launch";
import { useInfiniteQuery } from "@tanstack/react-query";

const LoadingCards = () => {
    return (
        <Grid container spacing={3} style={{ marginTop: "12px" }}>
            {Array.from(new Array(6)).map((item, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                    <Box style={{ background: "rgba(30, 41, 59, 0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                        <Skeleton variant="rect" height={160} style={{ borderRadius: "12px", backgroundColor: "rgba(255, 255, 255, 0.05)" }} />
                        <Box pt={2}>
                            <Skeleton style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }} />
                            <Skeleton width="70%" style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }} />
                        </Box>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
};

export default function App() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading
    } = useInfiniteQuery(
        ["marketNews"],
        async ({ pageParam = 1 }) => {
            const url = `/api/news/${pageParam}`;
            const response = await Axios.get(url);
            return response.data.data || [];
        },
        {
            getNextPageParam: (lastPage, allPages) => {
                if (!lastPage || lastPage.length === 0 || allPages.length >= 5) {
                    return undefined;
                }
                return allPages.length + 1;
            },
            staleTime: 1000 * 60 * 15,
        }
    );

    const items = data ? data.pages.flat() : [];

    return (
        <Container maxWidth="lg" style={{ paddingTop: "24px", paddingBottom: "60px" }}>
            <Box mb={4}>
                <Typography variant="h5" style={{ fontFamily: "Outfit", fontWeight: 700, color: "#f8fafc" }}>
                  Market News & Headlines
                </Typography>
                <Typography variant="body2" style={{ color: "#94a3b8", marginTop: "4px" }}>
                  Stay updated with global financial news, stock movements, and market intelligence.
                </Typography>
            </Box>

            {isLoading ? (
                <LoadingCards />
            ) : (
                <InfiniteScroll
                    dataLength={items.length}
                    next={fetchNextPage}
                    hasMore={Boolean(hasNextPage)}
                    loader={<LoadingCards />}
                    endMessage={
                        <Box textAlign="center" py={4}>
                            <Typography variant="body2" style={{ color: "#94a3b8", fontWeight: 600 }}>
                                ✨ You're all caught up on market news for today!
                            </Typography>
                        </Box>
                    }
                >
                    <Grid container spacing={3}>
                        {items?.map((item, index) => (
                            <Grid item key={index} xs={12} sm={6} md={4}>
                                <Card style={{
                                    height: "100%", display: "flex", flexDirection: "column",
                                    background: "rgba(30, 41, 59, 0.75)", backdropFilter: "blur(16px)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "20px",
                                    overflow: "hidden", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                                    transition: "all 0.3s ease"
                                }}>
                                    <Link href={item?.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                                        <div style={{ position: "relative", overflow: "hidden" }}>
                                            <CardMedia
                                                style={{ height: "180px", transition: "transform 0.4s ease" }}
                                                image={item?.image || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500"}
                                                title={item?.headline}
                                            />
                                            <div style={{
                                                position: "absolute", top: "12px", left: "12px",
                                                background: "rgba(15, 23, 42, 0.85)", backdropFilter: "blur(8px)",
                                                color: "#818cf8", fontSize: "11px", fontWeight: 700,
                                                padding: "4px 10px", borderRadius: "10px", border: "1px solid rgba(99, 102, 241, 0.3)"
                                            }}>
                                                {item?.source || "MARKET NEWS"}
                                            </div>

                                        </div>
                                    </Link>
                                    <CardContent style={{ flexGrow: 1, padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                        <Link href={item?.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
                                            <Typography variant="h6" style={{ fontFamily: "Outfit", fontWeight: 600, color: "#f8fafc", fontSize: "16px", lineHeight: 1.4 }}>
                                                {item?.headline}
                                            </Typography>
                                        </Link>
                                        <Box display="flex" alignItems="center" justifyContent="space-between" mt={2} pt={2} style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                                            <Typography variant="caption" style={{ color: "#64748b" }}>
                                                Read Article
                                            </Typography>
                                            <Link href={item?.url} target="_blank" rel="noopener noreferrer" style={{ color: "#818cf8", display: "flex", alignItems: "center", gap: "4px" }}>
                                                <LaunchIcon style={{ fontSize: "16px" }} />
                                            </Link>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </InfiniteScroll>
            )}
        </Container>
    );
}