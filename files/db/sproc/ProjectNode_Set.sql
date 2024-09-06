DROP PROCEDURE IF EXISTS [dbo].[ProjectNode_Set]
GO

CREATE PROCEDURE [dbo].[ProjectNode_Set]
    @ProjectId nvarchar(100),
    @Upserts [nvarchar](MAX),
    @RemoveIds [nvarchar](MAX)
AS
BEGIN
    MERGE [dbo].[ProjectNodes] AS target  
		USING (
			SELECT
        [Id] as [Id],
        [ParentId],
        [Order],
        [Title],
        [Description],
        [DisciplineIds],
        [PhaseIdAssociation],
        [LibraryLink],
        [LibraryTaskLink],
        [AbsFlag]
    FROM OPENJSON (@Upserts) WITH (
                [Id] nvarchar(100),
                [ParentId] nvarchar(100),
                [Order] int,
                [Title] nvarchar(MAX),
                [Description] nvarchar(MAX),
                [DisciplineIds] nvarchar(MAX),
                [PhaseIdAssociation] nvarchar(100),
                [LibraryLink] nvarchar(MAX),
                [LibraryTaskLink] nvarchar(MAX),
                [AbsFlag] bit
            )) AS source (
                [Id],
                [ParentId],
                [Order],
                [Title],
                [Description],
                [DisciplineIds],
                [PhaseIdAssociation],
                [LibraryLink],
                [LibraryTaskLink],
                [AbsFlag]
            )  
		ON (
            target.[ProjectId] = @ProjectId AND
        target.[Id] = source.[Id])  

		WHEN NOT MATCHED THEN
			INSERT (
                [Id],
                [ProjectId],
                [ParentId],
                [Order],
                [Title],
                [Description],
                [DisciplineIds],
                [PhaseIdAssociation],
                [LibraryLink],
                [LibraryTaskLink],
                [AbsFlag],
                [Removed],
                [CreatedOn],
                [LastModified])
            VALUES (
                source.[Id],
                @ProjectId,
                source.[ParentId],
                source.[Order],
                source.[Title],
                source.[Description],
                source.[DisciplineIds],
                source.[PhaseIdAssociation],
                source.[LibraryLink],
                source.[LibraryTaskLink],
                source.[AbsFlag],
                0,
                GETUTCDATE(),
                GETUTCDATE())
		WHEN MATCHED THEN
			UPDATE SET
                [Order] = source.[Order], 
                [Title] = source.[Title],  
                [Description] = source.[Description],  
                [DisciplineIds] = source.[DisciplineIds], 
                [PhaseIdAssociation] = source.[PhaseIdAssociation],  
                [LibraryLink] = source.[LibraryLink], 
                [LibraryTaskLink] = source.[LibraryTaskLink], 
                [AbsFlag] = source.[AbsFlag],
                [LastModified] = GETUTCDATE()
    ;

    UPDATE [dbo].[ProjectNodes]
    SET [Removed] = 1
    WHERE
        [ProjectId] = @ProjectId AND
        [Id] IN (SELECT [value]
        FROM OPENJSON(@RemoveIds))

    UPDATE [dbo].[Projects]
    SET [LastModified] = GETUTCDATE()
    WHERE [Id] = @ProjectId
END
GO
