DROP VIEW IF EXISTS [dbo].[ActivitiesView]
GO

CREATE VIEW [dbo].[ActivitiesView]
AS
    SELECT a.[Id]
        ,[Action]
        ,[Timestamp]
        ,[UserId]
        ,[TopLevelId]
        ,[ObjectId]
        ,[VersionId]
        ,[Data]
        ,l.[Icon] ActionIcon
        ,l.[Description] ActionDescription
        ,l.[Label] ActionTitle
    FROM [dbo].[Activities] a LEFT JOIN dbo.[Lists] l ON a.[Action] = l.[Id] AND l.[Type] = 'actions'
GO